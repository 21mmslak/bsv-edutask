## Work distribution

This assignment was completed during a video chat session between the group members where they discussed and worked together on completing it.

## 1. Qualities

### 1 An explanation, why an explicit definition of a quality is necessary before testing.
Before testing a quality, you must define an explicit threshold for what counts as acceptable. Otherwise the test produces data but no conclusion. Without a predefined criterion e.g. "the system must handle 1000 concurrent users with a response time under 2 seconds" there is no basis for deciding whether the system passes or fails.

Setting the threshold before testing is also essential to avoid bias: if the limit is chosen after seeing the results, it will naturally be adjusted to match whatever the system happened to achieve, making the test meaningless. A pre-defined definition ensures the evaluation is objective and comparable over time or across systems.

### 2. An explicit definition of three qualities (choose from accessibility, evolvability, interoperability, main-tainability, reliability, and safety).
Reliability: The system shall remain operational and produce correct results under defined conditions for a specified period. For example: the system must maintain 99.9% uptime over any rolling 30-day period.

Maintainability: The system shall allow a developer unfamiliar with the codebase to locate, understand, and fix a reported bug within x hours, without introducing new defects. This includes documentation, test coverage above 80%, and no critical code smells as reported by static analysis tools.

Safety: The system shall not enter a state that causes harm to users, third parties, or connected systems. For example: under any single point of failure, the system must automatically fall back to a safe state within x ms, and no failure mode may result in data corruption or unauthorized access.

### 3. A potential test technique for the each of the three chosen qualities.
Reliability — Load and endurance testing:
Run the system continuously under realistic or peak load conditions over an extended period e.g. 30 days, or simulated via time-compressed stress testing and monitor uptime, error rates, and recovery behavior. Tools like Apache JMeter, k6, Locust can simulate concurrent users while availability is tracked automatically.

Maintainability — Structured code review / static analysis:
Apply static analysis tools e.g. SonarQube, CodeClimate, ESLint / Pylint to measure code complexity, duplication, and test coverage against the predefined thresholds. This can be complemented by a controlled experiment where an unfamiliar developer is given a bug to fix and the time-to-resolution is measured.

Safety — Fault injection testing:
Deliberately introduce failures into the system e.g. kill a process, cut a network connection, corrupt an input and verify that the system detects the fault and transitions to the defined safe state within the required time. Each failure scenario is checked against the safety definition to produce a clear pass/fail result.

## 2. Static testing

### 1. An explanation of static test techniques as opposed to dynamic test techniques.
Static testing techniques analyze the software without executing it. Instead of running the code you inspect artifacts such as source code, documentation, or architecture diagrams directly. The goal is to find defects, structural weaknesses, violations of standards early. Before the system is even runnable. Examples include code reviews, walkthroughs, and static analysis tools.

Dynamic testing by contrast requires the software to actually run. Tests are executed with specific inputs and the system's behavior and outputs are observed against expected results. Examples include unit tests, integration tests, and load tests.
The key distinction is therefore: static = inspect without running, dynamic = observe while running. Static techniques are particularly valuable early in development when finding issues is cheaper to fix, while dynamic techniques are necessary to verify actual runtime behavior.

### 2. A static code review of the EduTask system and an evaluation of the systems extensibility in regard to the proposed change.
Overview of the architecture:
The backend follows a layered structure: blueprints handle HTTP routing, controllers contain business logic, and DAOs handle database access. The DAO class is generic and reusable it accepts any collection name and dynamically loads the corresponding JSON schema validator. This is a well-designed, extensible foundation.

How YouTube videos are currently handled:
A task is created in TaskController.create(), which expects a url field in the input data. This URL is immediately passed to self.videos_dao.create({'url': data['url']}), creating a video document and storing its ObjectId as a reference on the task. When a task is retrieved, populate_task() resolves this reference by fetching the document from videos_dao. The video.json validator defines the schema for this collection, requiring only a url field.

Extensibility evaluation:
The DAO layer is extensible. Adding a new article collection would only require creating an article.json validator no changes to DAO itself would be needed, which aligns well with the extensibility definition.However, the controller layer is not extensible. The following concrete issues were identified:
* TaskController.__init__() takes videos_dao as an explicit, hardcoded parameter. There is no generic resource_dao concept adding Medium articles would require adding another DAO parameter alongside it.
* TaskController.create() unconditionally calls self.videos_dao.create(...) with no branching or abstraction for resource type. Someone would need to modify this method directly to support articles.
* populate_task() always fetches from videos_dao, meaning it would also need to be modified to determine which DAO to use depending on resource type.
* There is no type field on the task or resource model, so there is no way to distinguish a YouTube video from a Medium article at runtime without restructuring the data model.
* The blueprint taskblueprint.py passes url directly with no concept of resource type, meaning the API contract would also need to change.

Conclusion:
The system has low extensibility with respect to this proposed change. While the data access layer is clean and generic, the absence of a resource abstraction in the controller means that adding Medium articles would require modifications in multiple places across existing, working code rather than additions in isolation. A more extensible design would introduce a generic Resource model with a type field and delegate resource-specific behavior through a factory or strategy pattern, keeping TaskController unmodified when new resource types are added.