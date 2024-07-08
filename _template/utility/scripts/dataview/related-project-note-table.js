let currentFileLink = dv.current().file.link;
dv.table(
	["Note", "Created", "Modified", "Related"],
	dv.pages()
        // .where(b => Link(b.relatedProject).path == currentFileLink.path)
		// Sort by YAML created field, but check whether there are multiple created dates
		.sort(b => b.file.mtime, 'desc')
		.map(b => [b.file.link, b.file.ctime, b.file.mtime, b.relatedProject])
)


// b["relatedProject"]