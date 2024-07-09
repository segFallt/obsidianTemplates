if (input) {
	// Add a header of level X, e.g. input = 2 means header level 2
	const name = dv.current().file.name.replace(/^@/, '')
	dv.header(input, 'Related Notes')
}
let currentFileLink = dv.current().file.link;
dv.table(
	["Note", "Modified"],
	dv.pages()
        .where(b => dv.func.contains(b.relatedProject, currentFileLink))
		// Sort by YAML created field, but check whether there are multiple created dates
		.sort(b => b.file.mtime, 'desc')
		.map(b => [b.file.link, b.file.mtime])
)

dv.paragraph("---");

if (input) {
	// Add a header of level X, e.g. input = 2 means header level 2
	const name = dv.current().file.name.replace(/^@/, '')
	dv.header(input, 'Notes referencing ' + name)
}
dv.table(
	["Note", "Location"],
	dv.pages("[[" + dv.current().file.name + "]]")
		.where(b => !dv.func.contains(b.relatedProject, dv.current().file.link))
		// Sort by YAML created field, but check whether there are multiple created dates
		.sort(b => b.file.mtime, 'desc')
		.map(b => [b.file.link, b.file.folder.replace(/\//g, ' ‣ ').replace(/^\d+ (.+)/, '$1')])
)

dv.paragraph("---");