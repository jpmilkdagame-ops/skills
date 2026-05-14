# Omega Kafka / Redpanda Topics

`topics.json` is the production topic contract for the Omega event backbone. Apply the same names to Kafka, Redpanda, or a managed Kafka service.

Required operational behavior:

- Invalid events go to `dead-letter` with validation errors.
- Task events keep at least seven days of replay history.
- Memory and alert streams keep longer retention for audits and incident review.
- Consumers should commit offsets only after memory write and trace emission succeed.
