const BACKEND = 'http://localhost:5001'
const FRONTEND = 'http://localhost:3000'

const login = (email) => {
  cy.visit(FRONTEND)
  cy.contains('div', 'Email Address').find('input[type=text]').type(email)
  cy.get('form').submit()
  cy.get('h1').should('contain.text', 'Your tasks')
}

const createTask = (title) => {
  cy.get('input#title').type(title)
  cy.get('input#url').type('dQw4w9WgXcQ')
  cy.get('input[value="Create new Task"]').click()
  cy.get('.container-element a').should('have.length.at.least', 1)
}

const openFirstTask = () => {
  cy.get('.container-element a').first().click()
  cy.get('.todo-list').should('be.visible')
}

const addTodo = (description) => {
  cy.get('.inline-form input[type="text"]').type(description, { force: true })
  cy.get('.inline-form input[type="submit"]').click({ force: true })
}

describe('R8UC1 - Add a todo item', () => {
  let uid
  let email

  before(() => {
    cy.fixture('user.json').then((user) => {
      cy.request({
        method: 'POST',
        url: `${BACKEND}/users/create`,
        form: true,
        body: user
      }).then((response) => {
        uid = response.body._id.$oid
        email = user.email
        login(email)
        createTask('Test Task R8UC1')
      })
    })
  })

  beforeEach(() => {
    login(email)
    openFirstTask()
  })

  after(() => {
    cy.request({ method: 'DELETE', url: `${BACKEND}/users/${uid}` })
  })

  // TC-R8UC1-1: Empty description -> Add button should be disabled
  it('TC-R8UC1-1: Add button is disabled when description is empty', () => {
    cy.get('.inline-form input[type="text"]').should('have.value', '')
    cy.get('.inline-form input[type="submit"]').should('be.disabled')
  })

  // TC-R8UC1-2: Non-empty description without pressing Add -> no todo added
  it('TC-R8UC1-2: Typing a description without submitting does not add a todo', () => {
    cy.get('.todo-list .todo-item').then(($items) => {
      const initialCount = $items.length
      cy.get('.inline-form input[type="text"]').type('A new todo item', { force: true })
      cy.get('.todo-list .todo-item').should('have.length', initialCount)
    })
  })

  // TC-R8UC1-3: Non-empty description + press Add -> new active todo appended
  it('TC-R8UC1-3: Entering a description and pressing Add appends a new active todo', () => {
    cy.get('.todo-list .todo-item').then(($items) => {
      const initialCount = $items.length
      addTodo('My new todo item')
      cy.get('.todo-list .todo-item').should('have.length', initialCount + 1)
      cy.get('.todo-list .todo-item').last().within(() => {
        cy.get('.checker').should('have.class', 'unchecked')
      })
      cy.get('.inline-form input[type="text"]').should('have.value', '')
    })
  })
})

describe('R8UC2 - Toggle a todo item', () => {
  let uid
  let email

  before(() => {
    cy.fixture('user.json').then((user) => {
      const testUser = { ...user, email: `r8uc2_${user.email}` }
      cy.request({
        method: 'POST',
        url: `${BACKEND}/users/create`,
        form: true,
        body: testUser
      }).then((response) => {
        uid = response.body._id.$oid
        email = testUser.email
        login(email)
        createTask('Test Task R8UC2')
      })
    })
  })

  beforeEach(() => {
    login(email)
    openFirstTask()
    addTodo('Toggle test todo')
    cy.get('.todo-list .todo-item').should('have.length.at.least', 1)
  })

  after(() => {
    cy.request({ method: 'DELETE', url: `${BACKEND}/users/${uid}` })
  })

  // TC-R8UC2-1: Active todo without clicking toggle -> remains active
  it('TC-R8UC2-1: Active todo remains active when toggle is not clicked', () => {
    cy.get('.todo-list .todo-item').last().within(() => {
      cy.get('.checker').should('have.class', 'unchecked')
    })
  })

  // TC-R8UC2-2: Click toggle on active todo -> becomes done
  it('TC-R8UC2-2: Clicking toggle on an active todo marks it as done', () => {
    cy.get('.todo-list .todo-item').last().within(() => {
      cy.get('.checker').should('have.class', 'unchecked').click()
    })
    cy.get('.todo-list .todo-item').last().within(() => {
      cy.get('.checker').should('have.class', 'checked')
    })
  })

  // TC-R8UC2-3: Done todo without clicking toggle -> remains done
  it('TC-R8UC2-3: Done todo remains done when toggle is not clicked', () => {
    cy.get('.todo-list .todo-item').last().within(() => {
      cy.get('.checker').click({ force: true })
    })
    cy.get('.todo-list .todo-item').last().within(() => {
      cy.get('.checker').should('have.class', 'checked')
    })
    cy.get('.todo-list .todo-item').last().within(() => {
      cy.get('.checker').should('have.class', 'checked')
    })
  })

  // TC-R8UC2-4: Click toggle on done todo -> becomes active
  it('TC-R8UC2-4: Clicking toggle on a done todo sets it back to active', () => {
    cy.get('.todo-list .todo-item').last().within(() => {
      cy.get('.checker').click({ force: true })
    })
    cy.get('.todo-list .todo-item').last().within(() => {
      cy.get('.checker').should('have.class', 'checked')
    })
    cy.get('.todo-list .todo-item').last().within(() => {
      cy.get('.checker').click({ force: true })
    })
    cy.get('.todo-list .todo-item').last().within(() => {
      cy.get('.checker').should('have.class', 'unchecked')
    })
  })
})

describe('R8UC3 - Delete a todo item', () => {
  let uid
  let email

  before(() => {
    cy.fixture('user.json').then((user) => {
      const testUser = { ...user, email: `r8uc3_${user.email}` }
      cy.request({
        method: 'POST',
        url: `${BACKEND}/users/create`,
        form: true,
        body: testUser
      }).then((response) => {
        uid = response.body._id.$oid
        email = testUser.email
        login(email)
        createTask('Test Task R8UC3')
      })
    })
  })

  beforeEach(() => {
    login(email)
    openFirstTask()
    addTodo('Todo for delete test')
    cy.get('.todo-list .todo-item').should('have.length.at.least', 1)
  })

  after(() => {
    cy.request({ method: 'DELETE', url: `${BACKEND}/users/${uid}` })
  })

  // TC-R8UC3-1: Delete all todos -> list becomes empty
  it('TC-R8UC3-1: Todo list is empty when all todo items have been deleted', () => {
    cy.get('.todo-list .todo-item').then(($items) => {
      const count = $items.length
      Cypress._.times(count, () => {
        cy.get('.todo-list .todo-item').first().within(() => {
          cy.get('.remover').click({ force: true })
        })
        cy.wait(300)
      })
      cy.get('.todo-list .todo-item').should('have.length', 0)
    })
  })

  // TC-R8UC3-2: Existing todo without clicking delete -> item remains
  it('TC-R8UC3-2: Todo item remains visible when delete is not clicked', () => {
    cy.get('.todo-list .todo-item').then(($items) => {
      const count = $items.length
      cy.get('.todo-list .todo-item').should('have.length', count)
    })
  })

  // TC-R8UC3-3: Click delete -> item removed
  it('TC-R8UC3-3: Clicking delete removes the todo item from the list', () => {
    cy.get('.todo-list .todo-item').then(($items) => {
      const initialCount = $items.length
      cy.get('.todo-list .todo-item').first().within(() => {
        cy.get('.remover').click({ force: true })
      })
      cy.get('.todo-list .todo-item').should('have.length', initialCount - 1)
    })
  })
})