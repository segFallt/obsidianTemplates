let currentFileLink = dv.current().file.link;

dv.table(
	["Engagement", "Status", "Start Date", "End Date"],
	dv.pages()
        .where(b => b.file.folder === "engagements" && b.file.tags.includes("#engagement") && dv.func.contains(b.client, currentFileLink))
		.sort(b => b.status === "Active" ? 0 : 1, 'asc')
		.sort(b => b["start-date"], 'desc')
		.map(b => [
			b.file.link,
			b.status,
			b["start-date"],
			b["end-date"]
		])
)
