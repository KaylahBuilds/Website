export default {
  slug: 'ghas-controls-automation-remediation',
  title: 'GitHub Security as Code: Controls, Tradeoffs, and Terraform',
  date: '2026-10-10',
  tags: ['security', 'Terraform', 'devsecops'],
  excerpt:
    'A Terraform-first approach to GitHub security: reviewable control changes, explicit repository ownership, and remediation you can verify.',
  body: (
    <>
      <p className="section-label">Security lab series / 01</p>
      <p>
        A repository can display a green workflow badge while shipping a vulnerable dependency. It can
        report a leaked credential while that credential remains active. Security tooling creates
        useful signals; engineering decisions turn those signals into protection.
      </p>
      <p>
        The GHAS Controls Lab uses Terraform to express the desired repository controls, review
        changes as a plan, and apply them deliberately. Application fixes remain a separate workflow:
        enabling a setting is not the same as repairing a vulnerable query, updating a dependency,
        or revoking a leaked credential. That distinction is the point of this lab.
      </p>

      <h2>Know what you are enabling</h2>
      <p>
        GitHub Advanced Security is not one universal switch. GitHub Code Security and GitHub Secret
        Protection are separate products, available to eligible Team or Enterprise accounts.
        Private and internal repositories need the relevant entitlement. Public GitHub.com
        repositories have a free subset, including code scanning, secret scanning, and dependency
        review; dependency graph and Dependabot alerts are core features. A personal private
        repository should not be assumed eligible for paid organization features. Check the{' '}
        <a href="https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security">
          official product availability
        </a>{' '}
        before promising a rollout.
      </p>

      <h2>Put each control at the right boundary</h2>
      <ul>
        <li>
          <strong>CodeQL:</strong> examines supported code for modeled vulnerability patterns.
          Without static analysis, a dangerous path may reach release unnoticed. Coverage depends
          on language, build configuration, and review of findings.
        </li>
        <li>
          <strong>Dependabot:</strong> surfaces known vulnerable dependencies and can propose
          security updates. Without ownership, even an available fix can sit untouched.
        </li>
        <li>
          <strong>Dependency review:</strong> checks dependency changes before merge. It complements
          existing-dependency alerts, rather than replacing them. Supported manifests and usable
          dependency data matter. See{' '}
          <a href="https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review">
            GitHub’s dependency review guidance
          </a>.
        </li>
        <li>
          <strong>Secret scanning and push protection:</strong> detect supported credentials and
          intercept supported leaks. Missing these controls can lengthen exposure; enabling them
          does not cover every possible secret or remove the need to govern bypasses.
        </li>
      </ul>
      <p>
        The tradeoff is real: runner time, licensing where applicable, alert triage, false-positive
        review, and upgrade maintenance. The risk of leaving controls off is lost visibility and
        fewer interception points—not proof that every unscanned repository is compromised.
      </p>

      <h2>Manage controls with Terraform</h2>
      <p>
        The configuration pins <code>integrations/github</code> to version <code>6.13.0</code>.
        For an existing repository, dedicated resources manage Dependabot alerts and security-update
        PRs without taking ownership of the repository's visibility, merge settings, or lifecycle.
        The minimal resource pair below illustrates that boundary; it is not the complete lab module.
      </p>
      <pre><code>{`resource "github_repository_vulnerability_alerts" "baseline" {
  repository = var.repository_name
  enabled    = true

  lifecycle { prevent_destroy = true }
}

resource "github_repository_dependabot_security_updates" "baseline" {
  repository = var.repository_name
  enabled    = true
  depends_on = [github_repository_vulnerability_alerts.baseline]

  lifecycle { prevent_destroy = true }
}`}</code></pre>
      <p>
        Set the owner explicitly in the provider, supply only a repository name to these resources,
        and authenticate outside the configuration. Use the provider's documented import procedure
        when adopting existing settings, and never manage the same object from two states. Review the
        pinned resource definitions for{' '}
        <a href="https://github.com/integrations/terraform-provider-github/blob/v6.13.0/docs/resources/repository_vulnerability_alerts.md">vulnerability alerts</a>{' '}
        and <a href="https://github.com/integrations/terraform-provider-github/blob/v6.13.0/docs/resources/repository_dependabot_security_updates.md">security updates</a>.
      </p>

      <h2>Separate an existing baseline from a disposable sandbox</h2>
      <p>
        The <code>terraform/existing-controls</code> root targets one existing repository. The
        separate <code>terraform/sandbox-security</code> root demonstrates Code Security, secret
        scanning, and push protection through <code>github_repository.security_and_analysis</code>.
        That second root owns a new disposable repository; do not import a production repository
        into it just to flip security settings. Its defaults would become a wider configuration decision.
      </p>
      <p>
        Paid capabilities require an explicit entitlement and cost review, not just a Boolean in a
        variables file. For public repositories, the sandbox also avoids setting the advanced-security flag
        that GitHub manages automatically. See the pinned{' '}
        <a href="https://github.com/integrations/terraform-provider-github/blob/v6.13.0/docs/resources/repository.md">repository resource documentation</a>.
        {' '}Neither example purchases a subscription or proves that scanning has run.
      </p>

      <h2>Review the plan, then verify the effect</h2>
      <p>
        After reviewing inputs, authentication, imports, and state ownership, work from the selected
        Terraform root. Format and validate the configuration before generating a saved plan:
      </p>
      <pre><code>{`terraform init
terraform fmt -check
terraform validate
terraform plan -out=reviewed.tfplan
terraform show reviewed.tfplan
# Only after reviewing the exact target and every change:
terraform apply reviewed.tfplan`}</code></pre>
      <p>
        A normal plan reads remote configuration but does not apply repository changes. A saved-plan
        apply does not ask for another interactive approval, so the review happens before that command.
        Stop on unexpected deletion, visibility changes, or unknown feature access. The{' '}
        <a href="https://developer.hashicorp.com/terraform/cli/commands/plan">Terraform plan reference</a>{' '}
        describes this separation; a clean plan is not evidence of a clean vulnerability scan.
      </p>
      <p>
        Keep tokens and private keys out of HCL and variables files. Treat state, saved plans, and
        JSON plan output as sensitive, and keep them out of Git; <code>sensitive = true</code> hides
        values in some output but does not encrypt state. Use a protected backend with appropriate
        access controls for shared work. Follow{' '}
        <a href="https://developer.hashicorp.com/terraform/language/manage-sensitive-data">HashiCorp's sensitive-data guidance</a>.
        {' '}Also review destroy behavior: removing a resource block can remove its
        <code> prevent_destroy</code> guard, and destroying a settings resource can disable a control.
      </p>

      <h2>Fix the behavior, not the alert count</h2>
      <h3>A query needs two separate protections</h3>
      <p>
        Terraform owns control configuration; Python is used only for this application-remediation
        example and its tests. The SQL exercise starts with an unsafe lookup that concatenates an email and omits tenant
        scope. The safe implementation binds both values:
      </p>
      <pre><code>{`connection.execute(
    "SELECT id, email FROM users WHERE tenant_id = ? AND email = ?",
    (authorized_tenant_id, email),
).fetchone()`}</code></pre>
      <p>
        Parameter binding prevents the email from becoming executable SQL. Trusted tenant scope
        prevents a different authorization failure. That scope must come from the authorization
        layer, not an unverified request parameter. In-memory regression tests cover injection,
        cross-tenant isolation, and ordinary allowed lookups.
      </p>
      <h3>Different findings need different repairs</h3>
      <p>
        For a dependency alert, inspect the affected range, update the manifest and lockfile,
        review compatibility, test, and verify the patched artifact reaches deployment. For a
        leaked credential, revoke or rotate it at its provider first. Deleting the file cannot
        invalidate copies already held elsewhere. GitHub’s{' '}
        <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository">
          sensitive-data cleanup guidance
        </a>{' '}
        makes that containment distinction explicit.
      </p>

      <h2>Make the merge gate real</h2>
      <p>
        Workflow templates end in <code>.example</code> and use manual triggers, so publication
        alone activates nothing. The optional Terraform ruleset starts disabled. Before requiring a check,
        ensure it runs on every relevant PR and confirm a failing sandbox change blocks merging.
        A successful analysis job is not a zero-vulnerability assertion.
      </p>
      <p>
        The pinned provider does not expose a CodeQL default-setup resource. Configure default setup
        deliberately through GitHub, or activate the reviewed advanced workflow—not both.
        Enabling Code Security is a prerequisite decision, not a substitute for configuring and
        validating the scanner.
      </p>
      <p>
        Actions are pinned to full commit SHAs, but pins still need reviewed updates. Keep workflow
        permissions minimal and never execute untrusted PR code in a privileged context. These
        choices follow GitHub’s{' '}
        <a href="https://docs.github.com/en/actions/reference/security/secure-use">
          secure workflow guidance
        </a>.
      </p>

      <h2>Validate the control, not just the configuration</h2>
      <ol>
        <li>Confirm repository scope, state ownership, permissions, and feature entitlement before planning.</li>
        <li>Run formatting, validation, and mocked Terraform tests; distinguish them from a real GitHub integration test.</li>
        <li>Review the saved plan, apply only in an authorized sandbox, then inspect the actual control settings.</li>
        <li>Verify required checks block an intentionally failing PR and supported secret test patterns trigger protection without using a real credential.</li>
        <li>Run the remediation regression tests, rescan the changed revision, and confirm the corrected artifact reaches deployment.</li>
      </ol>
      <p>
        No live Terraform apply, GitHub control activation, or scanner run has been performed for this
        walkthrough. Treat its examples as a starting point for the checks above, not production
        validation or an automatic incident-response system.
      </p>
      <p>
        Continue the series with{' '}
        <a href="/#/blog/woodpecker-hardened-ci-pipelines">hardened Woodpecker pipelines</a>,{' '}
        <a href="/#/blog/prowler-kubernetes-multicloud-scanning">scoped Prowler cloud scanning</a>,
        and <a href="/#/blog/kubernetes-opa-eks-aks">Kubernetes policy on EKS and AKS</a>.
      </p>
    </>
  ),
}
