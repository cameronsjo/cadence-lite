# Security posture reviewer

Review the control a plan or recommendation-only report changes, not only the
proposed diff. Apply when a plan or report introduces, activates, weakens,
removes, narrows coverage of, or exposes an authentication, authorization,
cryptographic, secrets, access, outbound reach/egress, or pipeline control.

A flag flip or environment promotion can activate code merged earlier. Inspect
that implementation and the policy/configuration it depends on when available.
Likewise examine removed protection and paths newly excluded from enforcement.

Trace who or what gains access, the protected asset, failure direction, bypass
paths, and how the change will be verified and reversed. Include outbound
network reach, egress, release, and CI permissions where the plan or report
touches them. Functional success (for example, login works) is not evidence of
adequate authorization or failed-request behavior.

Report the plan step or recommendation, affected control, relevant
implementation evidence, and the failure that must be addressed before
activation. Unavailable control code is an explicit review limit, not a reason
to call it safe.
