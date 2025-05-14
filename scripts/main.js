Events.on(ClientLoadEvent, () => {
    Vars.ui.settings.addCategory("Banned_words", "ohno", t => {
        t.textPref("banned_words_command", "");
        t.areaTextPref("banned_words_list", "");
    });

    Events.on(Packages.mindustry.game.EventType.PlayerChatEvent, e => {
        if (e.player == null) return;

        const list = Core.settings.getString("banned_words_list");
        if (!list) return;

        const bannedWords = list.split("\n").map(s => s.trim()).filter(s => s.length > 0);
        const message = e.message.toLowerCase();

        for (let word of bannedWords) {
            if (message.includes(word.toLowerCase())) {
                Vars.ui.showTextInput(
                    "BANNED WORD",
                    "user `[lime]" + e.player.name + "[]` wrote this:\n" + e.message + "\n\nthis contains `[red]" + word + "[]`. for how many hours should the user be kicked",
                    10,
                    "1",
                    true,
                    result => {
                        const hours = result;
                        const cmdTemplate = Core.settings.getString("banned_words_command");
                        const cmd = cmdTemplate
                            .replace("playerID", e.player.id)
                            .replace("hours", hours);
                        Call.sendChatMessage(cmd);
                    },
                    () => {}
                );
                break;
            }
        }
    });
});
