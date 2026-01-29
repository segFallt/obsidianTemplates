let currentFileLink = dv.current().file.link;

dv.table(
	["Project", "Status", "Priority", "Start Date"],
	dv.pages()
        .where(b => b.file.folder.startsWith("projects/") && b.file.tags.includes("#project") && dv.func.contains(b.engagement, currentFileLink))
		.sort(b => {
			const statusOrder = { "New": 1, "Active": 2, "On Hold": 3, "Complete": 4 };
			return statusOrder[b.status] || 5;
		}, 'asc')
		.sort(b => b.priority || 99, 'asc')
		.map(b => [
			b.file.link,
			b.status,
			b.priority,
			b["start-date"]
		])
)
