/*
 * Created By Anup Shrestha
 * Copyright (c) 2022. All rights reserved.
 * Last Modified 1/18/22, 3:47 PM
 *
 *
 */

Cypress.Commands.add("login", () => {
  Cypress.log({
    name: "login",
  });

  cy.visit("http://localhost:3000");

  cy.get("[data-testid=email]").clear().type("superadmin@sunya.health");
  cy.get("[data-testid=password]").clear().type("sunya.health{enter}");

  cy.wait(5000);
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

context("Members Page", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("http://localhost:3000/profile");
  });
});