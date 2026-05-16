describe("R8UC1 - Add Todo Item", () => {
  let user;
  let task;

  before(async () => {
    const fixtureUser = await cy.fixture("user.json");

    const response = await cy.request({
      method: "POST",
      url: "http://localhost:5000/users/create",
      form: true,
      body: fixtureUser,
    });

    user = {
      id: response.body._id.$oid,
      name: `${fixtureUser.firstName} ${fixtureUser.lastName}`,
      email: fixtureUser.email,
    };

    const fixtureTask = await cy.fixture("task.json");

    const response = await cy.request({
      method: "POST",
      url: "http://localhost:5000/tasks/create",
      form: true,
      body: { ...fixtureTask, userid: user.id },
    });

    task = response.body;
  });

  beforeEach(async () => {
    // enter the main main page
    cy.visit("http://localhost:3000");

    cy.contains("div", "Email Address")
      .find("input[type=text]")
      .type(user.email);

    cy.get("form").submit();
  });

  it("TC-R8UC1-1: disables Add button for empty description", () => {});

  it("TC-R8UC1-2: does not create todo without clicking Add", () => {});

  it("TC-R8UC1-3: creates todo for valid description", () => {});
});
