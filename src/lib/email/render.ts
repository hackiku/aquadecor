// lib/email/render.ts
async function renderEmail(
	templateKey: string,
	locale: string,
	vars: Record<string, string>
) {
	const template = await getTemplate(templateKey, locale);

	if (template.format === "react") {
		// Import from codebase
		const Component = await import(`./templates/${templateKey}`);
		return render(<Component { ...vars } />);
	}

	if (template.format === "html") {
		// Mustache rendering from DB
		return Mustache.render(template.body, vars);
	}
}