import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type TrialId = Nat;
  type EvidenceId = Nat;
  type EnrollmentId = Nat;
  type Timestamp = Int;

  type TaskBrief = {
    description : Text;
    checklist : [Text];
    deliverables : [Text];
  };

  type CareerTrial = {
    id : TrialId;
    name : Text;
    summary : Text;
    tags : [Text];
    daysToComplete : Nat;
    brief : TaskBrief;
  };

  type AspectScore = {
    aspect : Text;
    score : Nat;
  };

  type EvidenceCard = {
    id : EvidenceId;
    testerName : Text;
    trialName : Text;
    completionPercent : Nat;
    rating : Nat;
    aspectScores : [AspectScore];
  };

  type Enrollment = {
    id : EnrollmentId;
    trialId : TrialId;
    progressPercent : Nat;
    startedAt : Timestamp;
    updatedAt : Timestamp;
  };

  type TestOption = {
    id : Nat;
    text : Text;
  };

  type TestQuestion = {
    id : Nat;
    prompt : Text;
    options : [TestOption];
    correctOptionId : Nat;
    aspect : Text;
  };

  type StudentProfile = {
    displayName : Text;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    trials : Map.Map<TrialId, CareerTrial>;
    evidence : Map.Map<EvidenceId, EvidenceCard>;
    enrollments : Map.Map<Principal, Map.Map<EnrollmentId, Enrollment>>;
    var nextTrialId : Nat;
    var nextEvidenceId : Nat;
    nextEnrollmentId : { var nextEnrollmentId : Nat };
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    trials : Map.Map<TrialId, CareerTrial>;
    tests : Map.Map<TrialId, [TestQuestion]>;
    evidence : Map.Map<EvidenceId, EvidenceCard>;
    enrollments : Map.Map<Principal, Map.Map<EnrollmentId, Enrollment>>;
    profiles : Map.Map<Principal, StudentProfile>;
    var nextTrialId : Nat;
    nextEvidenceId : { var nextEvidenceId : Nat };
    nextEnrollmentId : { var nextEnrollmentId : Nat };
  };

  func option(id : Nat, text : Text) : TestOption = { id; text };

  func question(id : Nat, prompt : Text, options : [TestOption], correctOptionId : Nat, aspect : Text) : TestQuestion = {
    id;
    prompt;
    options;
    correctOptionId;
    aspect;
  };

  func seedTests() : Map.Map<TrialId, [TestQuestion]> {
    let tests = Map.empty<TrialId, [TestQuestion]>();
    tests.add(
      1,
      [
        question(
          1,
          "What is the first thing to decide when planning a campaign?",
          [option(1, "The exact wording of every post"), option(2, "Who the campaign is for"), option(3, "The colour of the logo")],
          2,
          "Creativity",
        ),
        question(
          2,
          "Which channel choice is best for reaching students at your school?",
          [option(1, "A channel your audience actually uses"), option(2, "The channel that costs the most"), option(3, "Every channel at once")],
          1,
          "Communication",
        ),
        question(
          3,
          "What makes a campaign message effective?",
          [option(1, "It lists every feature of the club"), option(2, "It says one clear thing"), option(3, "It uses as many words as possible")],
          2,
          "Communication",
        ),
        question(
          4,
          "Why track a single number for a campaign?",
          [option(1, "To judge whether the campaign worked"), option(2, "To make the plan look longer"), option(3, "To replace the campaign message")],
          1,
          "Analytical",
        ),
        question(
          5,
          "A weekly posting schedule helps mainly because it…",
          [option(1, "keeps the campaign consistent"), option(2, "guarantees more followers"), option(3, "removes the need for a message")],
          1,
          "Reliability",
        ),
      ],
    );
    tests.add(
      2,
      [
        question(
          1,
          "What should a poster communicate first?",
          [option(1, "The single most important message"), option(2, "The designer's name"), option(3, "Every detail of the event")],
          1,
          "Creativity",
        ),
        question(
          2,
          "Why choose a limited colour palette?",
          [option(1, "It makes the design cheaper to print"), option(2, "It keeps the design clear and consistent"), option(3, "It hides the main message")],
          2,
          "Creativity",
        ),
        question(
          3,
          "Type hierarchy on a poster is used to…",
          [option(1, "show what to read first"), option(2, "use every available font"), option(3, "fill empty space")],
          1,
          "Communication",
        ),
        question(
          4,
          "Why check the poster on a phone screen?",
          [option(1, "Most viewers may see it small"), option(2, "Phones print better"), option(3, "It changes the message")],
          1,
          "Analytical",
        ),
        question(
          5,
          "A clear reading order helps the viewer because it…",
          [option(1, "guides the eye through the design"), option(2, "adds more text"), option(3, "removes the need for a headline")],
          1,
          "Reliability",
        ),
      ],
    );
    tests.add(
      3,
      [
        question(
          1,
          "What is the first step in analysing a business problem?",
          [option(1, "Recommend a solution immediately"), option(2, "State the problem clearly"), option(3, "Blame a team member")],
          2,
          "Analytical",
        ),
        question(
          2,
          "Why separate facts from assumptions?",
          [option(1, "To avoid deciding on guesses"), option(2, "To make the report longer"), option(3, "To avoid asking questions")],
          1,
          "Analytical",
        ),
        question(
          3,
          "A good recommendation includes…",
          [option(1, "one action and a supporting reason"), option(2, "every possible action"), option(3, "no cost estimate")],
          1,
          "Problem Solving",
        ),
        question(
          4,
          "Why ask the owner questions before concluding?",
          [option(1, "To gather missing facts"), option(2, "To delay the work"), option(3, "To replace the analysis")],
          1,
          "Communication",
        ),
        question(
          5,
          "Comparing two possible causes helps because it…",
          [option(1, "tests which explanation fits the facts"), option(2, "doubles the workload"), option(3, "avoids a recommendation")],
          1,
          "Reliability",
        ),
      ],
    );
    tests.add(
      4,
      [
        question(
          1,
          "What should a budget list first?",
          [option(1, "The main costs of the event"), option(2, "The guest list"), option(3, "The venue's history")],
          1,
          "Organisation",
        ),
        question(
          2,
          "A run sheet is used to…",
          [option(1, "schedule each part of the event"), option(2, "record the budget"), option(3, "replace the invitations")],
          1,
          "Organisation",
        ),
        question(
          3,
          "Why assign a role to each person?",
          [option(1, "So nothing is left unowned"), option(2, "To reduce the guest count"), option(3, "To avoid a schedule")],
          1,
          "Communication",
        ),
        question(
          4,
          "Why identify risks before the event?",
          [option(1, "To prepare a backup for each"), option(2, "To cancel the event"), option(3, "To increase the budget")],
          1,
          "Problem Solving",
        ),
        question(
          5,
          "An invitation message should include…",
          [option(1, "what, when, and where"), option(2, "the full budget"), option(3, "the risk list")],
          1,
          "Reliability",
        ),
      ],
    );
    tests.add(
      5,
      [
        question(
          1,
          "What should you decide before writing content?",
          [option(1, "The topic and the format"), option(2, "The number of words"), option(3, "The publishing platform's logo")],
          1,
          "Creativity",
        ),
        question(
          2,
          "A strong headline tells the reader…",
          [option(1, "what they will learn"), option(2, "how long the piece is"), option(3, "who wrote it")],
          1,
          "Communication",
        ),
        question(
          3,
          "Why cut content that does not help the reader?",
          [option(1, "It keeps the piece focused"), option(2, "It makes the piece shorter to write"), option(3, "It removes the need for a headline")],
          1,
          "Analytical",
        ),
        question(
          4,
          "A call to action at the end is used to…",
          [option(1, "tell the reader what to do next"), option(2, "summarise the budget"), option(3, "list the sources")],
          1,
          "Communication",
        ),
        question(
          5,
          "Knowing your audience helps you…",
          [option(1, "choose the right tone and examples"), option(2, "avoid writing a draft"), option(3, "skip the headline")],
          1,
          "Reliability",
        ),
      ],
    );
    tests;
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      trials = old.trials;
      tests = seedTests();
      evidence = old.evidence;
      enrollments = old.enrollments;
      profiles = Map.empty();
      var nextTrialId = old.nextTrialId;
      nextEvidenceId = { var nextEvidenceId = old.nextEvidenceId };
      nextEnrollmentId = old.nextEnrollmentId;
    };
  };
};
