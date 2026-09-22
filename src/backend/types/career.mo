import Common "common";

module {
  public type TrialId = Common.TrialId;
  public type EvidenceId = Common.EvidenceId;
  public type EnrollmentId = Common.EnrollmentId;
  public type Timestamp = Common.Timestamp;

  /// A career trial in the public catalogue.
  public type CareerTrial = {
    id : TrialId;
    name : Text;
    summary : Text;
    tags : [Text];
    daysToComplete : Nat;
    brief : TaskBrief;
  };

  /// The detailed task brief shown in the trial pop-up.
  public type TaskBrief = {
    description : Text;
    checklist : [Text];
    deliverables : [Text];
  };

  /// A public evidence card produced by a tester.
  public type EvidenceCard = {
    id : EvidenceId;
    testerName : Text;
    trialName : Text;
    completionPercent : Nat;
    rating : Nat;
    aspectScores : [AspectScore];
  };

  /// One per-aspect score on an evidence card.
  public type AspectScore = {
    aspect : Text;
    score : Nat;
  };

  /// A student's enrolment in a career trial.
  public type Enrollment = {
    id : EnrollmentId;
    trialId : TrialId;
    progressPercent : Nat;
    startedAt : Timestamp;
    updatedAt : Timestamp;
  };

  /// A student's own enrolment view, including the trial name.
  public type EnrollmentView = {
    id : EnrollmentId;
    trialId : TrialId;
    trialName : Text;
    progressPercent : Nat;
    startedAt : Timestamp;
    updatedAt : Timestamp;
  };

  /// A student's own evidence card view.
  ///
  /// `trialId` identifies which trial the card was published for, so the
  /// student area can join a card back to the enrolment it came from.
  public type MyEvidenceCard = {
    id : EvidenceId;
    trialId : TrialId;
    trialName : Text;
    completionPercent : Nat;
    rating : Nat;
    aspectScores : [AspectScore];
  };

  /// Outcome of an enrolment operation.
  ///
  /// `#ok` is the success tag and carries the affected enrolment id; every
  /// other tag is a failure. Callers must treat `#ok` as success and any
  /// other variant as a failure.
  public type EnrollmentError = {
    #ok : EnrollmentId;
    #notSignedIn;
    #unknownTrial : TrialId;
    #alreadyEnrolled : TrialId;
    #notEnrolled : EnrollmentId;
    #invalidProgress : Nat;
  };

  // ---------------------------------------------------------------------------
  // Trial knowledge test
  // ---------------------------------------------------------------------------

  /// One answer option inside a test question.
  public type TestOption = {
    id : Nat;
    text : Text;
  };

  /// One multiple-choice question of a trial's knowledge test.
  ///
  /// `aspect` is the skill dimension this question scores, so a submitted
  /// attempt can be broken down into per-aspect scores. `correctOptionId`
  /// never leaves the backend: it is not part of `TestQuestionView`.
  public type TestQuestion = {
    id : Nat;
    prompt : Text;
    options : [TestOption];
    correctOptionId : Nat;
    aspect : Text;
  };

  /// A question as delivered to the student, without the correct answer.
  public type TestQuestionView = {
    id : Nat;
    prompt : Text;
    options : [TestOption];
    aspect : Text;
  };

  /// A trial's knowledge test as delivered to the student.
  public type TrialTestView = {
    trialId : TrialId;
    trialName : Text;
    questions : [TestQuestionView];
  };

  /// One answer submitted by the student: the chosen option for a question.
  public type TestAnswer = {
    questionId : Nat;
    optionId : Nat;
  };

  /// The auto-scored outcome of a submitted attempt.
  public type TestResult = {
    trialId : TrialId;
    trialName : Text;
    score : Nat;
    completionPercent : Nat;
    aspectScores : [AspectScore];
    evidenceId : EvidenceId;
  };

  /// Outcome of a test submission.
  ///
  /// `#ok` is the success tag and carries the auto-scored result; every other
  /// tag is a failure. Callers must treat `#ok` as success and any other
  /// variant as a failure.
  public type TestError = {
    #ok : TestResult;
    #notSignedIn;
    #unknownTrial : TrialId;
    #notEnrolled : TrialId;
    #incomplete : [Nat];
    #invalidAnswer : Nat;
  };

  /// The signed-in student's stored display name.
  public type StudentProfile = {
    displayName : Text;
  };

  /// Outcome of setting the caller's display name.
  public type ProfileError = {
    #ok;
    #notSignedIn;
    #invalidName;
  };
};
