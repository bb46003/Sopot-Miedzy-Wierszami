Hooks.once("init", async function () {
const myPackage = game.modules.get("sopot-miedzy-wierszami"); 
myPackage.socketHandler = new SocketHandler();
const MODULE_ID = "sopot-miedzy-wierszami";
    game.settings.register(MODULE_ID, "moduleVersion", {
        config: false,
        scope: "world",
        type: String,
        default: ""
    });
    game.settings.register(MODULE_ID, "adventureIported", {
        scope: "world",
        config: false,
        default: false,
        type: Boolean
    });    

})
Hooks.once("ready", async function () {
    const MODULE_ID = "sopot-miedzy-wierszami";
    if (game.user.isGM) {

        const module = game.modules.get(MODULE_ID);
        const moduleVersion = game.settings.get(MODULE_ID, "moduleVersion");
        const isNewerVersion = foundry.utils.isNewerVersion(module.version, moduleVersion);
        const adventureIsImported = game.settings.get(MODULE_ID, "adventureIported");
        if(adventureIsImported === false || isNewerVersion){
            const PACK_ID = "sopot-miedzy-wierszami.sopot-miedzy-wierszami"
            const pack = game.packs.get(PACK_ID);
            for (let content of pack.index.contents) {
                const adventure = await pack.getDocument(content._id);
                await adventure.sheet.render(true);    
            }
            game.settings.set(MODULE_ID, "moduleVersion", module.version);
            game.settings.set(MODULE_ID, "adventureIported", true);  
        }
    }
})
export class SocketHandler {
  constructor() {
    this.identifier = "module.sopot-miedzy-wierszami";
    this.registerSocketEvents();
  }
    registerSocketEvents() {
        game.socket.on(this.identifier, async (data) => {
            switch (data.type) {
                case "show-journal-page":
                    const entry = game.journal.get(data.entryId);
                    if (entry) entry.sheet.render(true, { pageId: data.pageId });
            }
        })
    }
}
Hooks.on("closeApplication", async function (adventure) {
        const packName = adventure.adventure.pack;
        if(packName === "sopot-miedzy-wierszami.sopot-miedzy-wierszami" && game.user.isGM){
            const mainSceen = game.scenes.get("jaB3zhgzLAEkoFVW");
            mainSceen.activate()
            const entry = await fromUuid("JournalEntry.q0cNZThwstP9FLPd");
            entry.sheet.render(true);

        }
    
})