# Collaborative Order — Project Overview

## Purpose

**Collaborative Order** is an experimental B2B print-order workflow concept created as a customer-development and exhibition demo for Printing United 2026.

The prototype tests a simple product hypothesis: a print job becomes easier to manage when the customer, CSR/order manager, design revisions, approval and production hand-off live inside one shared order workspace instead of being split across email, chat, local files and separate proofs.

This repository does **not** represent a finished production feature. It is a deterministic product-story prototype intended to communicate the workflow clearly enough for customer conversations, feedback and demand validation.

## Problem shown in the demo

The first half recreates a familiar print workflow:

1. A customer sends a roll-label order with specifications and artwork.
2. The job leaves the inbox and begins moving through files and proofs.
3. Customer corrections create more versions.
4. Prepress prepares another output.
5. Several files begin to look current or approved.
6. The customer asks: **“Which version should I approve?”**
7. Production is waiting while the team tries to establish which artwork is actually current.

The point is not that email or PDF proofs are inherently wrong. The problem is the fragmentation of job details, artwork versions, corrections and approval across different places.

## Proposed workflow

At the rewind, the same order starts again through Collaborative Order:

1. Dana creates one structured order for Willow & Co.
2. She chooses the customer, product and production options.
3. The order is created as a Draft.
4. Dana invites Emma, the customer, into the same order.
5. Emma receives a notification and opens the order on mobile.
6. She sees the current proof together with the order details.
7. She changes only the text fields she is allowed to edit.
8. The artwork updates while she types.
9. She saves **Version 2** and confirms that exact version.
10. Dana sees the same confirmed Version 2, performs the final check, and the print-ready output is generated.
11. The job becomes **Ready for production**.

Final narrative:

> Create. Customize. Confirm. Produce.  
> One order. One shared workspace.

## Fictional demo entities

All names and companies in the scenario are fictional demonstration data.

- **Printer:** Meridian Print Services
- **Customer:** Willow & Co.
- **Customer contact:** Emma Cole
- **Order manager / CSR:** Dana
- **Prepress:** Leo
- **Production:** Maya
- **Order:** ORD-2482
- **Product:** Roll label
- **Size:** 60 × 40 mm
- **Quantity:** 5,000 pcs
- **Stock:** Kraft / uncoated
- **Due date:** Jun 18, 2026

## What the prototype is intended to validate

The demo is useful for customer conversations around these questions:

- Is the fragmented approval/version problem recognizable and important?
- Would printers value a customer-facing shared order workspace for jobs that require collaboration before production?
- Is controlled customer editing useful when only certain copy should be changed?
- Does explicit confirmation of a specific design version reduce ambiguity?
- Is the workflow useful for commercial printers, label/specialty printers and other B2B print environments with repeated proof/revision cycles?
- Which parts belong inside a future product and which should stay integrated with existing MIS/ERP/prepress systems?

The prototype deliberately avoids answering all implementation questions. Its purpose is to make the workflow concrete enough that customers can react to it.

## Design principles used for this demo

- **Show the workflow, do not explain it with marketing slides.** The product UI itself tells the story.
- **Use familiar print terminology.** Job, artwork, proof, prepress, stock, adhesive, winding, approval, print-ready output.
- **Same job before and after rewind.** This makes the contrast understandable without changing the business case.
- **Deterministic HTML animation.** Exact timing, readable UI and repeatable recording mattered more than building a real backend.
- **Customer editing is controlled.** The customer changes specific permitted fields, not the entire design.
- **Approval is tied to an exact version.** The key outcome is removing ambiguity about what was approved.

## Final artifact

The final browser animation runs for **98 seconds** and was recorded as a 16:9 product-demo video with English voice-over.

The final source state is preserved in this archive branch together with technical context, reusable prompts and local-run helpers. The mastered MP4 and MP3 should live in `media/` once added to the repository or linked from durable company storage.
