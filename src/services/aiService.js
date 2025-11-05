export async function aiChat(messages) {
  const last = messages.at(-1)?.text?.toLowerCase() || "";
  await sleep(600);

  if (last.includes("які є групи фоп")) {
    return {
      text:
        "ФОП на спрощеній системі:\n" +
        "• 1 група — без найманих; річний дохід ≈1 млн грн.\n" +
        "• 2 група — до 10 працівників; дохід ≈5.9 млн грн.\n" +
        "• 3 група — без обмеження на працівників; дохід ≈8.2 млн грн.\n" +
        "• 4 група — для с/г виробників (спецрежим).",
    };
  }
  if (last.includes("it-фоп") || last.includes("іт-фоп")) {
    return { text: "Для IT найчастіше — 3 група (5% або 3%+ПДВ), без обмежень на працівників." };
  }
  return { text: "Окей! Уточніть запитання — про податки, ліміти чи витрати?" };
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
