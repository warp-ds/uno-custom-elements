const sheet = new CSSStyleSheet();
sheet.replaceSync(`
	@shadowReset;
	@styles;
`);
export default sheet;
