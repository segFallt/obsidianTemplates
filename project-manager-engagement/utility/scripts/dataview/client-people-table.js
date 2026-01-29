let currentFileLink = dv.current().file.link;

dv.table(
	["Person", "Status", "Title"],
	dv.pages()
        .where(b => b.file.folder === "people" && b.file.tags.includes("#person") && dv.func.contains(b.client, currentFileLink))
		.sort(b => b.status === "Active" ? 0 : 1, 'asc')
		.sort(b => b.file.name, 'asc')
		.map(b => [
			b.file.link,
			b.status,
			b.title
		])
)
