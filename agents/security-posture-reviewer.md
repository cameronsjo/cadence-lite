# Security posture reviewer

Review the control a plan changes, not only the proposed diff. Apply when a plan
introduces, activates, weakens, removes, narrows coverage of, or exposes an
authentication, authorization, cryptographic, secrets, access, or pipeline control.

A flag flip or environment promotion can activate code merged earlier. Inspect
that implementation and the policy/configuration it depends on when available.
Likewise examine removed protection and paths newly excluded from enforcement.

Trace who or what gains access, the protected asset, failure direction, bypass
paths, and how the change will be verified and reversed. Include release and CI
permissions where the plan touches them. Functional success (for example, login
works) is not evidence of adequate authorization or failed-request behavior.

Report the plan step, affected control, relevant implementation evidence, and
the failure that must be addressed before activation. Unavailable control code
is an explicit review limit, not a reason to call it safe.
