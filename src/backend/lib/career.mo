import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Types "../types/career";

module {
  /// Maximum accepted length of a student display name.
  let maxDisplayNameLength : Nat = 60;

  /// Fallback tester name when a student never set a display name.
  let defaultTesterName : Text = "Student";

  /// Returns the full public career trial catalogue.
  public func listTrials(trials : Map.Map<Types.TrialId, Types.CareerTrial>) : [Types.CareerTrial] {
    trials.values().toArray();
  };

  /// Returns one career trial by id, or null when it does not exist.
  public func getTrial(trials : Map.Map<Types.TrialId, Types.CareerTrial>, id : Types.TrialId) : ?Types.CareerTrial {
    trials.get(id);
  };

  /// Returns all public evidence cards.
  public func listEvidence(evidence : Map.Map<Types.EvidenceId, Types.EvidenceCard>) : [Types.EvidenceCard] {
    evidence.values().toArray();
  };

  /// Returns the caller's own enrolments with trial names.
  public func listMyEnrollments(
    trials : Map.Map<Types.TrialId, Types.CareerTrial>,
    enrollments : Map.Map<Principal, Map.Map<Types.EnrollmentId, Types.Enrollment>>,
    caller : Principal,
  ) : [Types.EnrollmentView] {
    let mine = enrollments.get(caller) ?? return [];
    let views = List.empty<Types.EnrollmentView>();
    for (enrollment in mine.values()) {
      let trialName = switch (trials.get(enrollment.trialId)) {
        case (?trial) { trial.name };
        case null { "" };
      };
      views.add({
        id = enrollment.id;
        trialId = enrollment.trialId;
        trialName;
        progressPercent = enrollment.progressPercent;
        startedAt = enrollment.startedAt;
        updatedAt = enrollment.updatedAt;
      });
    };
    views.toArray();
  };

  /// Returns the caller's own evidence cards.
  ///
  /// Cards are attributed by the caller's stored display name, the same
  /// attribution `getMyTestResult` and `submitTest` use, because the stable
  /// `EvidenceCard` carries no principal. An anonymous caller gets an empty
  /// list.
  ///
  /// Each card carries the `trialId` of the trial it was published for, so the
  /// student area can join a card back to the enrolment it came from. The
  /// stable `EvidenceCard` stores only the trial name, so the id is resolved
  /// against the catalogue; a card whose trial is no longer in the catalogue
  /// falls back to `0`, which matches no real trial.
  public func listMyEvidence(
    trials : Map.Map<Types.TrialId, Types.CareerTrial>,
    evidence : Map.Map<Types.EvidenceId, Types.EvidenceCard>,
    profiles : Map.Map<Principal, Types.StudentProfile>,
    caller : Principal,
  ) : [Types.MyEvidenceCard] {
    if (caller.isAnonymous()) {
      return [];
    };
    let testerName = switch (profiles.get(caller)) {
      case (?profile) { profile.displayName };
      case null { defaultTesterName };
    };
    let mine = List.empty<Types.MyEvidenceCard>();
    for (card in evidence.values()) {
      if (card.testerName == testerName) {
        mine.add({
          id = card.id;
          trialId = trialIdForName(trials, card.trialName);
          trialName = card.trialName;
          completionPercent = card.completionPercent;
          rating = card.rating;
          aspectScores = card.aspectScores;
        });
      };
    };
    mine.toArray();
  };

  /// Resolves a trial name back to its id, or `0` when no trial has that name.
  func trialIdForName(
    trials : Map.Map<Types.TrialId, Types.CareerTrial>,
    trialName : Text,
  ) : Types.TrialId {
    for (trial in trials.values()) {
      if (trial.name == trialName) {
        return trial.id;
      };
    };
    0;
  };

  /// Returns the caller's own stored test result for a trial, or null when the
  /// caller has not tested that trial or is not signed in.
  ///
  /// The result is derived from the caller's own published evidence card for
  /// that trial — never from another student's data. The card is matched by
  /// the caller's `testerName` and the trial's name, the same attribution
  /// `listMyEvidence` uses.
  public func getMyTestResult(
    trials : Map.Map<Types.TrialId, Types.CareerTrial>,
    evidence : Map.Map<Types.EvidenceId, Types.EvidenceCard>,
    profiles : Map.Map<Principal, Types.StudentProfile>,
    caller : Principal,
    trialId : Types.TrialId,
  ) : ?Types.TestResult {
    if (caller.isAnonymous()) {
      return null;
    };
    let trial = trials.get(trialId) ?? return null;
    let testerName = switch (profiles.get(caller)) {
      case (?profile) { profile.displayName };
      case null { defaultTesterName };
    };
    for (card in evidence.values()) {
      if (card.testerName == testerName and card.trialName == trial.name) {
        return ?{
          trialId;
          trialName = trial.name;
          score = card.rating;
          completionPercent = card.completionPercent;
          aspectScores = card.aspectScores;
          evidenceId = card.id;
        };
      };
    };
    null;
  };

  /// Enrols the caller in a trial.
  public func enroll(
    trials : Map.Map<Types.TrialId, Types.CareerTrial>,
    enrollments : Map.Map<Principal, Map.Map<Types.EnrollmentId, Types.Enrollment>>,
    nextEnrollmentId : { var nextEnrollmentId : Nat },
    caller : Principal,
    trialId : Types.TrialId,
  ) : Types.EnrollmentError {
    if (caller.isAnonymous()) {
      return #notSignedIn;
    };
    switch (trials.get(trialId)) {
      case null { return #unknownTrial(trialId) };
      case (?_) {};
    };
    let mine = switch (enrollments.get(caller)) {
      case (?existing) { existing };
      case null {
        let fresh = Map.empty<Types.EnrollmentId, Types.Enrollment>();
        enrollments.add(caller, fresh);
        fresh;
      };
    };
    for (enrollment in mine.values()) {
      if (enrollment.trialId == trialId) {
        return #alreadyEnrolled(trialId);
      };
    };
    let id = nextEnrollmentId.nextEnrollmentId;
    nextEnrollmentId.nextEnrollmentId := id + 1;
    let now = Time.now();
    mine.add(id, {
      id;
      trialId;
      progressPercent = 0;
      startedAt = now;
      updatedAt = now;
    });
    #ok(id);
  };

  /// Updates the caller's own enrolment progress.
  public func updateProgress(
    enrollments : Map.Map<Principal, Map.Map<Types.EnrollmentId, Types.Enrollment>>,
    caller : Principal,
    enrollmentId : Types.EnrollmentId,
    progressPercent : Nat,
  ) : Types.EnrollmentError {
    if (caller.isAnonymous()) {
      return #notSignedIn;
    };
    if (progressPercent > 100) {
      return #invalidProgress(progressPercent);
    };
    let mine = enrollments.get(caller) ?? return #notEnrolled(enrollmentId);
    switch (mine.get(enrollmentId)) {
      case null { return #notEnrolled(enrollmentId) };
      case (?enrollment) {
        mine.add(enrollmentId, {
          id = enrollment.id;
          trialId = enrollment.trialId;
          progressPercent;
          startedAt = enrollment.startedAt;
          updatedAt = Time.now();
        });
        #ok(enrollmentId);
      };
    };
  };

  // ---------------------------------------------------------------------------
  // Trial knowledge test
  // ---------------------------------------------------------------------------

  /// Returns the caller's stored display name, or null when unset.
  public func getMyProfile(
    profiles : Map.Map<Principal, Types.StudentProfile>,
    caller : Principal,
  ) : ?Types.StudentProfile {
    profiles.get(caller);
  };

  /// Stores the caller's display name, used as `testerName` on published cards.
  public func setMyDisplayName(
    profiles : Map.Map<Principal, Types.StudentProfile>,
    caller : Principal,
    displayName : Text,
  ) : Types.ProfileError {
    if (caller.isAnonymous()) {
      return #notSignedIn;
    };
    let trimmed = displayName.trim(#predicate(func c = c == ' ' or c == '\t' or c == '\n' or c == '\r'));
    if (trimmed.size() == 0 or trimmed.size() > maxDisplayNameLength) {
      return #invalidName;
    };
    profiles.add(caller, { displayName = trimmed });
    #ok;
  };

  /// Returns a trial's knowledge test without the correct answers.
  public func getTrialTest(
    trials : Map.Map<Types.TrialId, Types.CareerTrial>,
    tests : Map.Map<Types.TrialId, [Types.TestQuestion]>,
    trialId : Types.TrialId,
  ) : ?Types.TrialTestView {
    let trial = trials.get(trialId) ?? return null;
    if (trial.daysToComplete == 0) {
      return null;
    };
    let questions = tests.get(trialId) ?? return null;
    let views = questions.map(func(q) = {
      id = q.id;
      prompt = q.prompt;
      options = q.options;
      aspect = q.aspect;
    });
    ?{ trialId; trialName = trial.name; questions = views };
  };

  /// Scores a submitted attempt and publishes the resulting evidence card.
  public func submitTest(
    trials : Map.Map<Types.TrialId, Types.CareerTrial>,
    tests : Map.Map<Types.TrialId, [Types.TestQuestion]>,
    evidence : Map.Map<Types.EvidenceId, Types.EvidenceCard>,
    enrollments : Map.Map<Principal, Map.Map<Types.EnrollmentId, Types.Enrollment>>,
    profiles : Map.Map<Principal, Types.StudentProfile>,
    nextEvidenceId : { var nextEvidenceId : Nat },
    caller : Principal,
    trialId : Types.TrialId,
    answers : [Types.TestAnswer],
  ) : Types.TestError {
    if (caller.isAnonymous()) {
      return #notSignedIn;
    };
    let trial = switch (trials.get(trialId)) {
      case (?t) { t };
      case null { return #unknownTrial(trialId) };
    };
    let questions = switch (tests.get(trialId)) {
      case (?qs) { qs };
      case null { return #unknownTrial(trialId) };
    };
    let mine = switch (enrollments.get(caller)) {
      case (?m) { m };
      case null { return #notEnrolled(trialId) };
    };
    var enrolled = false;
    for (enrollment in mine.values()) {
      if (enrollment.trialId == trialId) {
        enrolled := true;
      };
    };
    if (not enrolled) {
      return #notEnrolled(trialId);
    };

    // Every question must be answered exactly once.
    let missing = List.empty<Nat>();
    for (question in questions.values()) {
      if (not answers.any(func(a) = a.questionId == question.id)) {
        missing.add(question.id);
      };
    };
    if (missing.size() > 0) {
      return #incomplete(missing.toArray());
    };

    // Every answer must reference a known question and one of its options.
    for (answer in answers.values()) {
      let question = switch (questions.find(func(q) = q.id == answer.questionId)) {
        case (?q) { q };
        case null { return #invalidAnswer(answer.questionId) };
      };
      if (not question.options.any(func(o) = o.id == answer.optionId)) {
        return #invalidAnswer(answer.questionId);
      };
    };

    // Score server-side: one point per correct answer.
    var correct = 0;
    for (question in questions.values()) {
      let chosen = answers.find(func(a) = a.questionId == question.id) ?? return #invalidAnswer(question.id);
      if (chosen.optionId == question.correctOptionId) {
        correct += 1;
      };
    };
    let total = questions.size();
    let score = if (total == 0) { 0 } else { correct * 100 / total };

    // Per-aspect breakdown, preserving first-seen aspect order.
    let aspects = List.empty<Text>();
    for (question in questions.values()) {
      if (not aspects.contains(question.aspect)) {
        aspects.add(question.aspect);
      };
    };
    let aspectScores = aspects.toArray().map(func(aspect) {
      var aspectCorrect = 0;
      var aspectTotal = 0;
      for (question in questions.values()) {
        if (question.aspect == aspect) {
          aspectTotal += 1;
          let chosen = answers.find(func(a) = a.questionId == question.id);
          switch (chosen) {
            case (?answer) {
              if (answer.optionId == question.correctOptionId) {
                aspectCorrect += 1;
              };
            };
            case null {};
          };
        };
      };
      {
        aspect;
        score = if (aspectTotal == 0) { 0 } else { aspectCorrect * 100 / aspectTotal };
      };
    });

    let completionPercent = score;
    let testerName = switch (profiles.get(caller)) {
      case (?profile) { profile.displayName };
      case null { defaultTesterName };
    };

    // Publish: the first attempt creates a card, a retake replaces it in place.
    var existingId : ?Types.EvidenceId = null;
    for (card in evidence.values()) {
      if (card.trialName == trial.name and card.testerName == testerName) {
        existingId := ?card.id;
      };
    };
    let evidenceId = switch (existingId) {
      case (?id) { id };
      case null {
        let id = nextEvidenceId.nextEvidenceId;
        nextEvidenceId.nextEvidenceId := id + 1;
        id;
      };
    };
    evidence.add(evidenceId, {
      id = evidenceId;
      testerName;
      trialName = trial.name;
      completionPercent;
      rating = score;
      aspectScores;
    });

    // Reflect the outcome on the caller's enrolment.
    for (enrollment in mine.values()) {
      if (enrollment.trialId == trialId) {
        mine.add(enrollment.id, {
          id = enrollment.id;
          trialId = enrollment.trialId;
          progressPercent = completionPercent;
          startedAt = enrollment.startedAt;
          updatedAt = Time.now();
        });
      };
    };

    #ok({
      trialId;
      trialName = trial.name;
      score;
      completionPercent;
      aspectScores;
      evidenceId;
    });
  };
};
