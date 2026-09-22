import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Expose "mo:caffeineai-oql/Expose";
import OQL "mo:caffeineai-oql";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import IntValue "mo:caffeineai-oql/IntValue";
import TextValue "mo:caffeineai-oql/TextValue";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";
import CareerApiMixin "mixins/career-api";
import ApiDocMixin "mixins/api-doc";
import Types "types/career";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let trials : Map.Map<Types.TrialId, Types.CareerTrial>;
  let tests : Map.Map<Types.TrialId, [Types.TestQuestion]>;
  let evidence : Map.Map<Types.EvidenceId, Types.EvidenceCard>;
  let enrollments : Map.Map<Principal, Map.Map<Types.EnrollmentId, Types.Enrollment>>;
  let profiles : Map.Map<Principal, Types.StudentProfile>;
  var nextTrialId : Nat;
  let nextEvidenceId : { var nextEvidenceId : Nat };
  let nextEnrollmentId : { var nextEnrollmentId : Nat };

  include MixinAuthorization(accessControlState, null);
  include CareerApiMixin(trials, tests, evidence, enrollments, profiles, nextTrialId, nextEvidenceId, nextEnrollmentId);
  include ApiDocMixin();

  /// Flattens the per-student enrolment map into (owner, enrollment) rows so
  /// the OQL entity can promote the owner principal as a queryable column.
  func flattenEnrollments() : Iter.Iter<(Principal, Types.Enrollment)> {
    let rows = List.empty<(Principal, Types.Enrollment)>();
    for ((owner, mine) in enrollments.entries()) {
      for (enrollment in mine.values()) {
        rows.add((owner, enrollment));
      };
    };
    rows.values();
  };

  /// Flattens `tests : Map<TrialId, [TestQuestion]>` into (trialId, question)
  /// rows so the trial id in the outer key becomes a queryable column. The
  /// question's `options` array is summarised as text because OQL cannot
  /// auto-derive a nested array field.
  func flattenTestQuestions() : Iter.Iter<(Types.TrialId, Types.TestQuestion)> {
    let rows = List.empty<(Types.TrialId, Types.TestQuestion)>();
    for ((trialId, questions) in tests.entries()) {
      for (question in questions.values()) {
        rows.add((trialId, question));
      };
    };
    rows.values();
  };

  /// Flattens `profiles : Map<Principal, StudentProfile>` into (owner, profile)
  /// rows so the student principal in the key becomes a queryable column.
  func flattenProfiles() : Iter.Iter<(Principal, Types.StudentProfile)> {
    let rows = List.empty<(Principal, Types.StudentProfile)>();
    for ((owner, profile) in profiles.entries()) {
      rows.add((owner, profile));
    };
    rows.values();
  };

  /// Renders a question's answer options as a single text summary, e.g.
  /// "1: Yes | 2: No". Used because OQL manual mode cannot carry a nested
  /// array column.
  func optionsSummary(options : [Types.TestOption]) : Text {
    options.values().map(func (option : Types.TestOption) : Text = option.id.toText() # ": " # option.text).join(" | ");
  };

  include Expose({
    entities = [
      trials
        .toEntityManual("careerTrial", "CareerTrial", "id")
        .sample({
          id = 0;
          name = "";
          summary = "";
          tags = [];
          daysToComplete = 0;
          brief = { description = ""; checklist = []; deliverables = [] };
        })
        .payload("id", func (t : Types.CareerTrial) : Nat = t.id)
        .payload("name", func (t : Types.CareerTrial) : Text = t.name)
        .payload("summary", func (t : Types.CareerTrial) : Text = t.summary)
        .payload("daysToComplete", func (t : Types.CareerTrial) : Nat = t.daysToComplete)
        .public_()
        .build(),
      evidence
        .toEntityManual("evidenceCard", "EvidenceCard", "id")
        .sample({
          id = 0;
          testerName = "";
          trialName = "";
          completionPercent = 0;
          rating = 0;
          aspectScores = [];
        })
        .payload("id", func (e : Types.EvidenceCard) : Nat = e.id)
        .payload("testerName", func (e : Types.EvidenceCard) : Text = e.testerName)
        .payload("trialName", func (e : Types.EvidenceCard) : Text = e.trialName)
        .payload("completionPercent", func (e : Types.EvidenceCard) : Nat = e.completionPercent)
        .payload("rating", func (e : Types.EvidenceCard) : Nat = e.rating)
        .public_()
        .build(),
      // `enrollments : Map<Principal, Map<EnrollmentId, Enrollment>>` — the
      // student's principal lives in the outer key, not in the row, so flatten
      // the nested map into (owner, enrollment) pairs and promote the owner as
      // a column. Each signed-in student reads only their own rows; the
      // controller (Data Intelligence agent) reads all rows for aggregates.
      OQL.Entity.manual<(Principal, Types.Enrollment)>(
        "enrollment",
        func () = flattenEnrollments(),
        "Enrollment",
        "id",
      )
        .sample((Principal.fromText("aaaaa-aa"), { id = 0; trialId = 0; progressPercent = 0; startedAt = 0; updatedAt = 0 }))
        .payload("owner", func ((owner, _) : (Principal, Types.Enrollment)) : Principal = owner)
        .payload("id", func ((_, e) : (Principal, Types.Enrollment)) : Nat = e.id)
        .payload("trialId", func ((_, e) : (Principal, Types.Enrollment)) : Nat = e.trialId)
        .payload("progressPercent", func ((_, e) : (Principal, Types.Enrollment)) : Nat = e.progressPercent)
        .payload("startedAt", func ((_, e) : (Principal, Types.Enrollment)) : Int = e.startedAt)
        .payload("updatedAt", func ((_, e) : (Principal, Types.Enrollment)) : Int = e.updatedAt)
        .edge("trialId", "careerTrial")
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
      // `tests : Map<TrialId, [TestQuestion]>` — the trial id lives in the outer
      // key and the value is an array, so flatten to (trialId, question) rows.
      // `TestQuestion` contains `options : [TestOption]`, which OQL cannot
      // auto-derive (M0230), so manual mode is used and the options array is
      // summarised as text. `correctOptionId` is deliberately omitted: it must
      // never leave the backend.
      OQL.Entity.manual<(Types.TrialId, Types.TestQuestion)>(
        "testQuestion",
        func () = flattenTestQuestions(),
        "TestQuestion",
        "id",
      )
        .sample((0, { id = 0; prompt = ""; options = []; correctOptionId = 0; aspect = "" }))
        .payload("trialId", func ((trialId, _) : (Types.TrialId, Types.TestQuestion)) : Nat = trialId)
        .payload("id", func ((_, q) : (Types.TrialId, Types.TestQuestion)) : Nat = q.id)
        .payload("prompt", func ((_, q) : (Types.TrialId, Types.TestQuestion)) : Text = q.prompt)
        .payload("options", func ((_, q) : (Types.TrialId, Types.TestQuestion)) : Text = optionsSummary(q.options))
        .payload("aspect", func ((_, q) : (Types.TrialId, Types.TestQuestion)) : Text = q.aspect)
        .edge("trialId", "careerTrial")
        .public_()
        .build(),
      // `profiles : Map<Principal, StudentProfile>` — the student principal lives
      // in the key, so flatten to (owner, profile) rows and promote the owner as
      // a column. Each signed-in student reads only their own row; the
      // controller (Data Intelligence agent) reads all rows.
      OQL.Entity.manual<(Principal, Types.StudentProfile)>(
        "studentProfile",
        func () = flattenProfiles(),
        "StudentProfile",
        "owner",
      )
        .sample((Principal.fromText("aaaaa-aa"), { displayName = "" }))
        .payload("owner", func ((owner, _) : (Principal, Types.StudentProfile)) : Principal = owner)
        .payload("displayName", func ((_, p) : (Principal, Types.StudentProfile)) : Text = p.displayName)
        .ownedBy("owner")
        .controllerOrScoped()
        .build(),
    ];
  });
};
