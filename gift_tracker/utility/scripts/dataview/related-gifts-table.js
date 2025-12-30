// related-gifts-table.js
// Shows gifts related to an individual (given to and received from)
//
// Usage:
//   await dv.view("scripts/dataview/related-gifts-table", {
//     individual: dv.current().file.name
//   })
//
// Input Parameters:
//   individual - The name of the individual to find gifts for

const config = input || {};
const individualName = config.individual;

if (!individualName) {
  dv.paragraph("*No individual specified*");
  return;
}

// Helper to check if an individual is in the list
const containsIndividual = (individuals, name) => {
  if (!individuals) return false;
  if (Array.isArray(individuals)) {
    return individuals.some(ind => {
      if (!ind) return false;
      // Handle link objects
      if (ind.path) return ind.path.includes(name);
      // Handle string links like [[Name]]
      const str = String(ind);
      return str.includes(name);
    });
  }
  // Single value
  const str = String(individuals);
  return str.includes(name);
};

// Query gifts given to this individual
const giftsGiven = dv.pages('#gift-given')
  .where(p => containsIndividual(p.individuals, individualName))
  .sort(p => p.date, 'desc');

// Query gifts received from this individual
const giftsReceived = dv.pages('#gift-received')
  .where(p => containsIndividual(p.individuals, individualName))
  .sort(p => p.date, 'desc');

// Display gifts given
if (giftsGiven.length > 0) {
  dv.header(2, "Gifts Given");
  dv.table(
    ["Gift", "Date", "Occasion", "Cost"],
    giftsGiven.map(g => [
      g.file.link,
      g.date,
      g.occasion || "",
      g.cost ? `$${g.cost}` : ""
    ])
  );
} else {
  dv.header(2, "Gifts Given");
  dv.paragraph("*No gifts given yet*");
}

// Display gifts received
if (giftsReceived.length > 0) {
  dv.header(2, "Gifts Received");
  dv.table(
    ["Gift", "Date", "Occasion", "Est. Cost", "Thank You"],
    giftsReceived.map(g => [
      g.file.link,
      g.date,
      g.occasion || "",
      g['estimated-cost'] ? `$${g['estimated-cost']}` : "",
      g['thank-you-sent'] ? "✓" : ""
    ])
  );
} else {
  dv.header(2, "Gifts Received");
  dv.paragraph("*No gifts received yet*");
}

// Display gift ideas for this individual
const giftIdeas = dv.pages('#gift-idea')
  .where(p => containsIndividual(p.individuals, individualName))
  .sort(p => p.status, 'asc');

if (giftIdeas.length > 0) {
  dv.header(2, "Gift Ideas");
  dv.table(
    ["Idea", "Occasion", "Est. Cost", "Status"],
    giftIdeas.map(g => [
      g.file.link,
      g.occasion || "",
      g['estimated-cost'] ? `$${g['estimated-cost']}` : "",
      g.status || ""
    ])
  );
}
