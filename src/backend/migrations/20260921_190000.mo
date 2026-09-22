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

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    trials : Map.Map<TrialId, CareerTrial>;
    evidence : Map.Map<EvidenceId, EvidenceCard>;
    enrollments : Map.Map<Principal, Map.Map<EnrollmentId, Enrollment>>;
    var nextTrialId : Nat;
    var nextEvidenceId : Nat;
    nextEnrollmentId : { var nextEnrollmentId : Nat };
  };

  func aspect(name : Text, score : Nat) : AspectScore = { aspect = name; score };

  func brief(description : Text, checklist : [Text], deliverables : [Text]) : TaskBrief = {
    description;
    checklist;
    deliverables;
  };

  func seedTrials() : Map.Map<TrialId, CareerTrial> {
    let trials = Map.empty<TrialId, CareerTrial>();
    trials.add(
      1,
      {
        id = 1;
        name = "Marketing";
        summary = "Plan a small campaign for a student club and explain how you would reach the right audience.";
        tags = ["Creativity", "Communication", "Analytical"];
        daysToComplete = 5;
        brief = brief(
          "You are the marketing lead for a student club that wants more members. Build a short campaign plan: who you are talking to, what message you send, and where you send it.",
          [
            "Pick one audience and describe them in three sentences",
            "Write a one-line campaign message",
            "Choose two channels and explain why each fits",
            "Sketch a simple weekly posting schedule",
            "List one number you would track to judge success",
          ],
          [
            "A one-page campaign plan",
            "A sample social post with caption",
            "A short note on how you would measure results",
          ],
        );
      },
    );
    trials.add(
      2,
      {
        id = 2;
        name = "Graphic Design";
        summary = "Design a simple poster for a school event and explain the choices behind your layout.";
        tags = ["Creativity", "Communication", "Organisation"];
        daysToComplete = 4;
        brief = brief(
          "A school event needs a poster. Create a design that is clear from a distance and explain the colour, type, and layout decisions you made.",
          [
            "Write down the single most important message of the poster",
            "Choose a colour palette and justify it",
            "Pick two typefaces and set a clear hierarchy",
            "Lay out the poster with a clear reading order",
            "Check that the design still reads when shrunk to a phone screen",
          ],
          [
            "One poster design",
            "A short written rationale for your design choices",
            "A second version with one deliberate change",
          ],
        );
      },
    );
    trials.add(
      3,
      {
        id = 3;
        name = "Business Analysis";
        summary = "Break down a small business problem, gather the facts, and recommend a practical next step.";
        tags = ["Analytical", "Communication", "Problem Solving"];
        daysToComplete = 6;
        brief = brief(
          "A local cafe is losing customers in the afternoon. Investigate the problem, separate what you know from what you assume, and recommend one action.",
          [
            "Write the problem in one sentence",
            "List three questions you would ask the owner",
            "Separate the facts you have from the assumptions you are making",
            "Compare two possible causes",
            "Recommend one action and state what it would cost",
          ],
          [
            "A one-page problem analysis",
            "A simple table of facts versus assumptions",
            "A recommendation with one supporting reason",
          ],
        );
      },
    );
    trials.add(
      4,
      {
        id = 4;
        name = "Event Planning";
        summary = "Plan a small school event end to end, from the budget to the run sheet for the day.";
        tags = ["Organisation", "Communication", "Problem Solving"];
        daysToComplete = 7;
        brief = brief(
          "Plan a two-hour school event for about fifty people. Cover the budget, the schedule, the people you need, and what could go wrong.",
          [
            "Set a budget and list the main costs",
            "Write a run sheet with times for each part of the event",
            "List the roles you need and who fills each one",
            "Identify two risks and a backup for each",
            "Write a short message inviting people to attend",
          ],
          [
            "A budget sheet",
            "A run sheet for the day",
            "A short risk list with backups",
          ],
        );
      },
    );
    trials.add(
      5,
      {
        id = 5;
        name = "Content Creation";
        summary = "Write and structure a short piece of content that teaches one useful thing to a student audience.";
        tags = ["Creativity", "Communication", "Analytical"];
        daysToComplete = 4;
        brief = brief(
          "Create a short piece of content that teaches one useful skill to other students. Choose the format, write it, and explain who it is for.",
          [
            "Choose one topic and one format",
            "Write a headline that says what the reader will learn",
            "Draft the content in a clear order",
            "Cut anything that does not help the reader",
            "Add one call to action at the end",
          ],
          [
            "One finished piece of content",
            "A short note on the audience you wrote for",
            "A list of two ideas for follow-up content",
          ],
        );
      },
    );
    trials.add(
      6,
      {
        id = 6;
        name = "Coming next";
        summary = "More career trials are on the way. Check back soon to try a new role.";
        tags = ["Coming soon"];
        daysToComplete = 0;
        brief = brief(
          "",
          [],
          [],
        );
      },
    );
    trials;
  };

  func seedEvidence() : Map.Map<EvidenceId, EvidenceCard> {
    let evidence = Map.empty<EvidenceId, EvidenceCard>();
    evidence.add(
      1,
      {
        id = 1;
        testerName = "Linh Nguyen";
        trialName = "Marketing";
        completionPercent = 92;
        rating = 88;
        aspectScores = [
          aspect("Creativity", 90),
          aspect("Communication", 85),
          aspect("Problem Solving", 80),
          aspect("Reliability", 95),
        ];
      },
    );
    evidence.add(
      2,
      {
        id = 2;
        testerName = "Minh Tran";
        trialName = "Graphic Design";
        completionPercent = 78;
        rating = 81;
        aspectScores = [
          aspect("Creativity", 88),
          aspect("Communication", 72),
          aspect("Problem Solving", 76),
          aspect("Reliability", 84),
        ];
      },
    );
    evidence.add(
      3,
      {
        id = 3;
        testerName = "An Pham";
        trialName = "Business Analysis";
        completionPercent = 100;
        rating = 94;
        aspectScores = [
          aspect("Creativity", 74),
          aspect("Communication", 90),
          aspect("Problem Solving", 96),
          aspect("Reliability", 92),
        ];
      },
    );
    evidence.add(
      4,
      {
        id = 4;
        testerName = "Bao Le";
        trialName = "Event Planning";
        completionPercent = 65;
        rating = 70;
        aspectScores = [
          aspect("Creativity", 68),
          aspect("Communication", 75),
          aspect("Problem Solving", 66),
          aspect("Reliability", 72),
        ];
      },
    );
    evidence.add(
      5,
      {
        id = 5;
        testerName = "Chi Hoang";
        trialName = "Content Creation";
        completionPercent = 85;
        rating = 86;
        aspectScores = [
          aspect("Creativity", 92),
          aspect("Communication", 88),
          aspect("Problem Solving", 74),
          aspect("Reliability", 80),
        ];
      },
    );
    evidence.add(
      6,
      {
        id = 6;
        testerName = "Duc Vu";
        trialName = "Marketing";
        completionPercent = 55;
        rating = 62;
        aspectScores = [
          aspect("Creativity", 70),
          aspect("Communication", 58),
          aspect("Problem Solving", 60),
          aspect("Reliability", 64),
        ];
      },
    );
    evidence;
  };

  public func migration(_old : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      trials = seedTrials();
      evidence = seedEvidence();
      enrollments = Map.empty();
      var nextTrialId = 7;
      var nextEvidenceId = 7;
      nextEnrollmentId = { var nextEnrollmentId = 1 };
    };
  };
};
