import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/career";
import CareerLib "../lib/career";

mixin (
  trials : Map.Map<Types.TrialId, Types.CareerTrial>,
  tests : Map.Map<Types.TrialId, [Types.TestQuestion]>,
  evidence : Map.Map<Types.EvidenceId, Types.EvidenceCard>,
  enrollments : Map.Map<Principal, Map.Map<Types.EnrollmentId, Types.Enrollment>>,
  profiles : Map.Map<Principal, Types.StudentProfile>,
  nextTrialId : Nat,
  nextEvidenceId : { var nextEvidenceId : Nat },
  nextEnrollmentId : { var nextEnrollmentId : Nat },
) {
  // `nextTrialId` is reserved for future catalogue growth; the seeded
  // catalogue is fixed for this build.
  ignore nextTrialId;

  /// Public career trial catalogue.
  public query func listTrials() : async [Types.CareerTrial] {
    CareerLib.listTrials(trials);
  };

  /// One career trial by id.
  public query func getTrial(id : Types.TrialId) : async ?Types.CareerTrial {
    CareerLib.getTrial(trials, id);
  };

  /// Public evidence cards.
  public query func listEvidence() : async [Types.EvidenceCard] {
    CareerLib.listEvidence(evidence);
  };

  /// The caller's own enrolments.
  public query ({ caller }) func listMyEnrollments() : async [Types.EnrollmentView] {
    CareerLib.listMyEnrollments(trials, enrollments, caller);
  };

  /// The caller's own evidence cards.
  public query ({ caller }) func listMyEvidence() : async [Types.MyEvidenceCard] {
    CareerLib.listMyEvidence(trials, evidence, profiles, caller);
  };

  /// The caller's own stored test result for a trial, or null when untested.
  public query ({ caller }) func getMyTestResult(trialId : Types.TrialId) : async ?Types.TestResult {
    CareerLib.getMyTestResult(trials, evidence, profiles, caller, trialId);
  };

  /// Enrol the caller in a career trial.
  public shared ({ caller }) func enroll(trialId : Types.TrialId) : async Types.EnrollmentError {
    CareerLib.enroll(trials, enrollments, nextEnrollmentId, caller, trialId);
  };

  /// Update the caller's own enrolment progress.
  public shared ({ caller }) func updateProgress(enrollmentId : Types.EnrollmentId, progressPercent : Nat) : async Types.EnrollmentError {
    CareerLib.updateProgress(enrollments, caller, enrollmentId, progressPercent);
  };

  /// The caller's stored display name, or null when unset.
  public query ({ caller }) func getMyProfile() : async ?Types.StudentProfile {
    CareerLib.getMyProfile(profiles, caller);
  };

  /// Store the caller's display name, used as `testerName` on published cards.
  public shared ({ caller }) func setMyDisplayName(displayName : Text) : async Types.ProfileError {
    CareerLib.setMyDisplayName(profiles, caller, displayName);
  };

  /// A trial's knowledge test, without the correct answers.
  public query func getTrialTest(trialId : Types.TrialId) : async ?Types.TrialTestView {
    CareerLib.getTrialTest(trials, tests, trialId);
  };

  /// Submit a test attempt; the backend scores it and publishes an evidence card.
  public shared ({ caller }) func submitTest(trialId : Types.TrialId, answers : [Types.TestAnswer]) : async Types.TestError {
    CareerLib.submitTest(trials, tests, evidence, enrollments, profiles, nextEvidenceId, caller, trialId, answers);
  };
};
