(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "../../../FormsLibrary/dist/forms/fesm2015/forms.js":
/*!************************************************************************!*\
  !*** /Users/alex/Repository/FormsLibrary/dist/forms/fesm2015/forms.js ***!
  \************************************************************************/
/*! exports provided: Application, BLOCK, Block, CONNECT, DATABASE, DESTROY, DISCONNECT, DefaultMenu, DefaultMenuHandler, FORM, Field, Form, FormArea, FormList, FormsLibrary, HIDE, INIT, MenuArea, MenuHandler, Preferences, SHOW, Transaction, WINDOW, WIZARD */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Application", function() { return Application; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLOCK", function() { return BLOCK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Block", function() { return Block; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONNECT", function() { return CONNECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DATABASE", function() { return DATABASE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DESTROY", function() { return DESTROY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DISCONNECT", function() { return DISCONNECT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultMenu", function() { return DefaultMenu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefaultMenuHandler", function() { return DefaultMenuHandler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FORM", function() { return FORM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Field", function() { return Field; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Form", function() { return Form; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormArea", function() { return FormArea; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormList", function() { return FormList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormsLibrary", function() { return FormsLibrary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HIDE", function() { return HIDE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INIT", function() { return INIT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MenuArea", function() { return MenuArea; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MenuHandler", function() { return MenuHandler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Preferences", function() { return Preferences; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SHOW", function() { return SHOW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transaction", function() { return Transaction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WINDOW", function() { return WINDOW; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WIZARD", function() { return WIZARD; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "../../../FormsLibrary/node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");





class Themes {
    static add(theme) {
        Themes.themes.set(theme.name.toLowerCase(), theme);
    }
    static get(name) {
        return (Themes.themes.get(name.toLowerCase()));
    }
}
Themes.themes = new Map();
class defaultTheme {
    constructor() {
        this.name = "default";
        this.link = "blue";
        this.text = "white";
        this.title = "white";
        this.topbar = "#303f9f";
        this.disabled = "silver";
        this.buttontext = "white";
        this.foldertree = "#303f9f";
    }
}
class Indigo extends defaultTheme {
    constructor() {
        super(...arguments);
        this.name = "indigo";
    }
}
class Grey extends defaultTheme {
    constructor() {
        super(...arguments);
        this.name = "grey";
        this.link = "grey";
        this.topbar = "grey";
        this.foldertree = "grey";
    }
}
class Pink extends defaultTheme {
    constructor() {
        super(...arguments);
        this.name = "pink";
        this.link = "#ff4081";
        this.topbar = "#ff4081";
        this.foldertree = "#ff4081";
    }
}
class Yellow {
    constructor() {
        this.name = "yellow";
        this.link = "grey";
        this.text = "white";
        this.title = "black";
        this.topbar = "yellow";
        this.foldertree = "grey";
        this.disabled = "silver";
        this.buttontext = "black";
    }
}

class Preferences {
    constructor() {
        if (Preferences.scol == null) {
            Themes.add(new Yellow());
            Themes.add(new Pink());
            Themes.add(new Grey());
            Themes.add(new Indigo());
            Themes.add(new defaultTheme());
            Preferences.scol = new Colors(Themes.get("default"));
        }
        if (Preferences.senv == null)
            Preferences.senv = new Environment();
        this.colors$ = Preferences.scol;
        this.environment$ = Preferences.senv;
    }
    static notify(instance, func) {
        Preferences.notifications.push({ instance: instance, func: func });
    }
    get colors() {
        return (this.colors$);
    }
    get environment() {
        return (this.environment$);
    }
    setTheme(theme) {
        let ttheme = null;
        if (typeof theme == 'object')
            ttheme = theme;
        else
            ttheme = Themes.get(theme);
        if (ttheme != null) {
            Preferences.scol = ttheme;
            this.colors$ = Preferences.scol;
            Preferences.notifications.forEach((notify) => { notify.instance[notify.func](); });
        }
    }
    addTheme(theme) {
        Themes.add(theme);
    }
}
Preferences.scol = null;
Preferences.senv = null;
Preferences.notifications = [];
class Colors {
    constructor(theme) {
        this.setTheme(theme);
    }
    setTheme(theme) {
        let ttheme = null;
        if (typeof theme == 'object')
            ttheme = theme;
        else
            ttheme = Themes.get(theme);
        this.name = ttheme.name;
        this.link = ttheme.link;
        this.text = ttheme.text;
        this.title = ttheme.title;
        this.topbar = ttheme.topbar;
        this.foldertree = ttheme.foldertree;
        this.disabled = ttheme.disabled;
        this.buttontext = ttheme.buttontext;
    }
}
class Environment {
    constructor() {
        this.lang = Intl.DateTimeFormat().resolvedOptions().locale;
    }
}

class Config {
    constructor(client) {
        this.client = client;
        this.config = {};
    }
    getConfig() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_1__["__awaiter"])(this, void 0, void 0, function* () {
            let inv = this.client.get("/assets/config.json").toPromise();
            yield inv.then(data => { this.config = data; }, error => { console.log("Loading config failed: " + error); });
            return (this.config);
        });
    }
}

class MenuHandler {
    constructor() {
        this.ready$ = false;
        this.menu$ = null;
        this.guid$ = MenuHandler._id++;
        Reflect.defineProperty(this, "_setProtected", { value: (intf) => {
                this.menu$ = intf;
                this.ready$ = true;
            } });
    }
    get guid() {
        return (this.guid$);
    }
    get ready() {
        return (this.ready$);
    }
    get app() {
        return (this.menu$.app);
    }
    enable(menu) {
        this.menu$.enable(menu);
    }
    disable(menu) {
        this.menu$.disable(menu);
    }
    get connected() {
        return (this.menu$.isConnected());
    }
}
MenuHandler._id = 0;

class DefaultMenuHandler extends MenuHandler {
    onInit() {
        this.init();
    }
    onConnect() {
        this.init();
    }
    onDisconnect() {
        this.init();
    }
    onTransactio(action) {
    }
    onFormChange(form) {
        this.form = form;
        if (this.ready)
            this.init();
    }
    init() {
        this.disable();
        if (this.form != null) {
            if (this.connected)
                this.enable();
            else
                this.enable("/form/close");
            this.disable("/transaction");
        }
        if (this.connected) {
            this.disable("/connection/connect");
            this.enable("/connection/disconnect");
        }
        else {
            this.enable("/connection/connect");
            this.disable("/connection/disconnect");
        }
    }
    connect() {
        this.app.connect();
        this.init();
    }
    disconnect() {
        this.app.disconnect();
        this.init();
    }
    close() {
        this.form.close(false);
        this.init();
    }
}

class DefaultMenu {
    constructor() {
        this.entries =
            [
                {
                    name: "Connection", title: "Connection to database", options: [
                        { name: "connect", action: "connect" },
                        { name: "disconnect", action: "disconnect" },
                    ]
                },
                {
                    name: "Query", title: "Query actions", options: [
                        { name: "enter", action: null },
                        { name: "execute", action: null },
                        { name: "cancel", action: null },
                    ]
                },
                {
                    name: "Record", title: "Record actions", options: [
                        { name: "insert", action: null },
                        { name: "delete", action: null },
                        { name: "dublicate", action: null },
                        { name: "undo", action: null },
                        { name: "clear", action: null },
                    ]
                },
                {
                    name: "Block", title: "Block actions", options: [
                        { name: "undo", action: null },
                        { name: "clear", action: null },
                    ]
                },
                {
                    name: "Form", title: "Form actions", options: [
                        { name: "undo", action: null },
                        { name: "clear", action: null },
                        { name: "close", action: "close" },
                    ]
                },
                {
                    name: "Transaction", title: "Transaction Menu", options: [
                        { name: "commit", action: null },
                        { name: "rollback", action: null },
                    ]
                }
            ];
        this.handler = new DefaultMenuHandler();
    }
    getHandler() {
        return (this.handler);
    }
    getEntries() {
        return (this.entries);
    }
}

class Protected {
    static get(comp, type) {
        let impl = null;
        if (type == null)
            impl = comp._getProtected();
        else
            impl = comp._getProtected(type);
        return (impl);
    }
    static set(comp, args, type) {
        if (type == null)
            comp._setProtected(args);
        else
            comp._setProtected(args, type);
    }
}

class MenuInterface {
    constructor(menu) {
        this.menu = menu;
        this.impl$ = Protected.get(this.menu);
    }
    get app() {
        return (this.impl$.getApplication());
    }
    isConnected() {
        return (this.impl$.appstate.connected());
    }
    enable(menu) {
        this.menu.enable(menu);
    }
    disable(menu) {
        this.menu.disable(menu);
    }
}

class Listener {
    constructor() { }
    static add(id, clazz, event) {
        let events = Listener.events.get(event);
        if (events == null) {
            events = new Map();
            Listener.events.set(event, events);
            let listener = new Listener();
            listener.start(event);
        }
        events.set(id, clazz);
    }
    static remove(id, event) {
        let events = Listener.events.get(event);
        events.delete(id);
    }
    start(eventtype) {
        window.addEventListener(eventtype, (event) => { this.onEvent(event); });
    }
    onEvent(event) {
        let events = Listener.events.get(event.type);
        events.forEach((clazz) => { clazz.onEvent(event); });
    }
}
Listener.events = new Map();

const _c0 = ["html"];
class DropDownMenu {
    constructor() {
        this.options = new Map();
        this.menus = new Map();
        this.instance = "DropDownMenu-" + (DropDownMenu.instances++);
        Reflect.defineProperty(this, "_getProtected", { value: () => { return (this.app); } });
    }
    static setForm(inst, form) {
        if (inst.instance.getMenu() == null) {
            if (DropDownMenu.calls++ > 10)
                return;
            setTimeout(() => { DropDownMenu.setForm(inst, form); }, 10);
            return;
        }
        inst.instance.getMenu().getHandler().onFormChange(form);
    }
    getMenu() {
        return (this.menu);
    }
    enable(menu) {
        if (menu == null) {
            this.menus.forEach((mopt) => {
                mopt.elem.classList.remove("ddmenu-disabled");
                mopt.options.forEach((opt) => { opt.elem.children[0].classList.remove("ddmenu-disabled"); });
            });
            return;
        }
        menu = menu.toLowerCase();
        let mopt = this.menus.get(menu);
        if (mopt != null) {
            mopt.elem.classList.remove("ddmenu-disabled");
            mopt.options.forEach((opt) => { opt.elem.children[0].classList.remove("ddmenu-disabled"); });
            return;
        }
        let option = menu;
        mopt = this.menus.get(menu.substring(0, menu.lastIndexOf("/")));
        if (mopt == null)
            return;
        let enabled = 0;
        mopt.options.forEach((opt) => {
            if (opt.elem.id == option)
                opt.elem.children[0].classList.remove("ddmenu-disabled");
            if (!opt.elem.children[0].classList.contains("ddmenu-disabled"))
                enabled++;
        });
        if (enabled > 0)
            mopt.elem.classList.remove("ddmenu-disabled");
    }
    disable(menu) {
        if (menu == null) {
            this.menus.forEach((mopt) => {
                mopt.elem.classList.add("ddmenu-disabled");
                mopt.options.forEach((opt) => { opt.elem.children[0].classList.add("ddmenu-disabled"); });
            });
            return;
        }
        menu = menu.toLowerCase();
        let mopt = this.menus.get(menu);
        if (mopt != null) {
            mopt.elem.classList.add("ddmenu-disabled");
            mopt.options.forEach((opt) => { opt.elem.children[0].classList.add("ddmenu-disabled"); });
            return;
        }
        let option = menu;
        mopt = this.menus.get(menu.substring(0, menu.lastIndexOf("/")));
        if (mopt == null)
            return;
        let enabled = 0;
        mopt.options.forEach((opt) => {
            if (opt.elem.id == option)
                opt.elem.children[0].classList.add("ddmenu-disabled");
            if (!opt.elem.children[0].classList.contains("ddmenu-disabled"))
                enabled++;
        });
        if (enabled == 0)
            mopt.elem.classList.add("ddmenu-disabled");
    }
    display(app, menu) {
        if (this.html == null) {
            setTimeout(() => { this.display(app, menu); }, 10);
            return;
        }
        this.app = app;
        if (menu == null)
            menu = new DefaultMenu();
        this.menu = menu;
        let intf = new MenuInterface(this);
        Protected.set(menu.getHandler(), intf);
        this.menu = menu;
        this.html.innerHTML = this.menuhtml();
        let menus = this.html.getElementsByClassName("ddmenu-menu");
        let options = this.html.getElementsByClassName("ddmenu-option");
        for (let i = 0; i < menus.length; i++) {
            let mopt = new MenuOption(menus[i].children[0]);
            this.menus.set(mopt.elem.id, mopt);
            mopt.elem.classList.add("dddmenu-isabled");
            mopt.elem.addEventListener("click", (event) => { this.toggle(event); });
        }
        for (let i = 0; i < options.length; i++) {
            let id = options[i].id;
            let menu = id.substring(0, id.lastIndexOf("/"));
            let opt = this.options.get(id);
            options[i].children[0].classList.add("ddmenu-disabled");
            options[i].addEventListener("click", (event) => { this.action(event); });
            opt.elem = options[i];
            let mopt = this.menus.get(menu);
            mopt.options.push(opt);
        }
        menu.getHandler().onInit();
    }
    onEvent(event) {
        if (!event.target.matches('.ddmenu-entry')) {
            this.closeall();
            Listener.remove(this.instance, "click");
        }
    }
    action(event) {
        let handler = this.menu.getHandler();
        let link = null;
        let text = event.target;
        if (text.classList.contains("ddmenu-linktext")) {
            link = text.parentElement;
        }
        else {
            link = text;
            text = text.children[0];
        }
        if (text.classList.contains("ddmenu-disabled"))
            return;
        let opt = this.options.get(link.id);
        if (opt.option.action != null)
            handler[opt.option.action]();
    }
    toggle(event) {
        let menu = event.target;
        let container = menu.parentNode.children[1];
        if (menu.classList.contains("ddmenu-disabled"))
            return;
        container.classList.toggle("ddmenu-show");
        if (container.classList.contains("ddmenu-show")) {
            this.closeall(container);
            Listener.add(this.instance, this, "click");
        }
        else {
            container.classList.remove("ddmenu-show");
        }
    }
    closeall(except) {
        let open = this.html.getElementsByClassName("ddmenu-show");
        for (let i = 0; i < open.length; i++) {
            if (except == null || open[i].id != except.id)
                open[i].classList.remove("ddmenu-show");
        }
    }
    menuhtml() {
        let html = "";
        html += "<html>\n";
        html += "  <head>\n";
        html += "    <style>\n";
        html += this.styles() + "\n";
        html += "    </style>\n";
        html += "  </head>\n";
        html += "  <body>\n";
        html += "    <span class='ddmenu-bar'>\n";
        html += this.entries("", "", this.menu.getEntries());
        html += "    </span>\n";
        html += "  </body>\n";
        html += "</html>\n";
        return (html);
    }
    entries(indent, path, entries) {
        let html = "";
        for (let i = 0; i < entries.length; i++) {
            let id = path + "/" + entries[i].name.toLowerCase();
            html += indent + "<div class='ddmenu-menu'>\n";
            html += indent + "  <button class='ddmenu-entry' id='" + id + "'";
            html += indent + " style='margin-left: 4px; margin-right: 4px'>\n";
            html += indent + entries[i].name;
            html += indent + "  </button>\n";
            html += indent + "  <div class='ddmenu-content' id='" + id + "-content'>\n";
            if (entries[i].options != null) {
                for (let f = 0; f < entries[i].options.length; f++) {
                    let entry = entries[i].options[f];
                    let oid = id + "/" + entry.name.toLowerCase();
                    this.options.set(oid, new Option(entries[i].options[f]));
                    html += indent + "    <a class='ddmenu-option' id='" + oid + "'>\n";
                    html += indent + "      <span class='ddmenu-linktext'>" + entry.name + "</span>\n";
                    html += indent + "    </a>\n";
                }
            }
            html += indent + "  </div>\n";
            html += indent + "</div>\n";
        }
        return (html);
    }
    styles() {
        let prefs = new Preferences();
        let style = `
            .ddmenu-bar
            {
                width: 100%;
                height: 100%;
                display: flex;
                position: relative;
                white-space: nowrap;
                background: transparent;
            }

            .ddmenu-entry
            {
                border: none;
                color: ` + prefs.colors.buttontext + `;
                outline:none;
                cursor: pointer;
                font-size: 16px;
                background: transparent;
            }

            .ddmenu-disabled
            {
                color: ` + prefs.colors.disabled + `;
            }

            .ddmenu-menu
            {
                position: relative;
                display: inline-block;
            }

            .ddmenu-content
            {
                z-index: 1;
                display: none;
                overflow: none;
                min-width: 80px;
                position: absolute;
                background-color: #f1f1f1;
                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            }

            .ddmenu-option
            {
                border: none;
                color: black;
                outline:none;
                cursor: pointer;
                font-size: 16px;
                background: transparent;
            }

            .ddmenu-content .ddmenu-option
            {
                color: black;
                display: block;
                padding: 12px 16px;
                text-decoration: none;
            }

            .ddmenu-content .ddmenu-option:hover
            {
                background-color: #ddd;
            }

            .ddmenu-show
            {
                display: block;
            }
        `;
        return (style);
    }
    ngAfterViewInit() {
        var _a;
        this.html = (_a = this.elem) === null || _a === void 0 ? void 0 : _a.nativeElement;
    }
}
DropDownMenu.instances = 0;
DropDownMenu.calls = 0;
DropDownMenu.ɵfac = function DropDownMenu_Factory(t) { return new (t || DropDownMenu)(); };
DropDownMenu.ɵcmp = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"])({ type: DropDownMenu, selectors: [["ng-component"]], viewQuery: function DropDownMenu_Query(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c0, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
    } if (rf & 2) {
        var _t;
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.elem = _t.first);
    } }, decls: 2, vars: 0, consts: [["html", ""]], template: function DropDownMenu_Template(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(0, "div", null, 0);
    } }, encapsulation: 2 });
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(DropDownMenu, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: '',
                template: '<div #html></div>'
            }]
    }], function () { return []; }, { elem: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["html", { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }] }); })();
class MenuOption {
    constructor(elem) {
        this.options = [];
        this.elem = elem;
    }
}
class Option {
    constructor(option) {
        this.option = option;
    }
}

class MenuFactory {
    constructor(builder) {
        this.builder = builder;
    }
    create(app, menu) {
        let ref = this.builder.createComponent(DropDownMenu);
        ref.instance.display(app, menu);
        return (ref);
    }
}

class Utils {
    getName(component) {
        if (component == null)
            return (null);
        let name = component.constructor.name;
        if (name == "String")
            name = component;
        if (name == "Function")
            name = component.name;
        return (name.toLowerCase());
    }
    getType(component) {
        let type = null;
        let code = "" + component;
        if (code.startsWith("class")) {
            code = code.substring(0, code.indexOf("{"));
            let pos = code.indexOf("extends");
            if (pos > 0) {
                let pos1 = code.indexOf("[", pos);
                let pos2 = code.indexOf("]", pos1);
                type = code.substring(pos1 + 2, pos2 - 1);
            }
        }
        return (type);
    }
}

class BlockDefinitions {
    static setBlockDefaultAlias(block, alias) {
        if (alias == null)
            alias = block;
        BlockDefinitions.dalias.set(block, alias);
    }
    static getBlockDefaultAlias(alias) {
        alias = alias.toLowerCase();
        let bname = BlockDefinitions.dalias.get(alias);
        if (bname == null)
            bname = alias;
        return (bname);
    }
    static setBlock(form, def) {
        let blocks = BlockDefinitions.blocks.get(form.toLowerCase());
        if (blocks == null) {
            blocks = [];
            BlockDefinitions.blocks.set(form.toLowerCase(), blocks);
        }
        if (def.prop != null)
            blocks.push(def);
        else
            blocks.unshift(def);
    }
    static getBlocks(form) {
        let blocks = BlockDefinitions.blocks.get(form.toLowerCase());
        if (blocks == null)
            blocks = [];
        return (blocks);
    }
}
BlockDefinitions.dalias = new Map();
BlockDefinitions.blocks = new Map();

class DBUsage {
    static merge(changes, base) {
        let merged = base;
        if (changes == null)
            return (merged);
        if (changes.hasOwnProperty("query"))
            merged.query = changes.query;
        if (changes.hasOwnProperty("insert"))
            merged.insert = changes.insert;
        if (changes.hasOwnProperty("update"))
            merged.update = changes.update;
        if (changes.hasOwnProperty("delete"))
            merged.delete = changes.delete;
        return (merged);
    }
}

class DatabaseDefinitions {
    static setFormUsage(form, usage) {
        DatabaseDefinitions.fdefault.set(form, usage);
    }
    static getFormUsage(form) {
        let usage = DatabaseDefinitions.fdefault.get(form.toLowerCase());
        if (usage == null)
            usage = { query: false, insert: false, update: false, delete: false };
        return (usage);
    }
    static setBlockDefault(block, usage) {
        DatabaseDefinitions.bdefault.set(block, usage);
    }
    static getBlockDefault(block) {
        let usage = null;
        let base = {
            query: false,
            insert: false,
            update: false,
            delete: false
        };
        if (block != null)
            usage = DatabaseDefinitions.bdefault.get(block.toLowerCase());
        return (DBUsage.merge(usage, base));
    }
    static setBlockUsage(form, prop, usage) {
        let opts = DatabaseDefinitions.usage.get(form);
        if (opts == null) {
            opts = [];
            DatabaseDefinitions.usage.set(form, opts);
        }
        let dbopts = { prop: prop, usage: usage };
        opts.unshift(dbopts);
    }
    static getBlockUsage(form) {
        let usage = DatabaseDefinitions.usage.get(form.toLowerCase());
        if (usage == null)
            usage = [];
        return (usage);
    }
}
DatabaseDefinitions.usage = new Map();
DatabaseDefinitions.bdefault = new Map();
DatabaseDefinitions.fdefault = new Map();

class FormImpl {
    constructor(form$) {
        this.form$ = form$;
        this.cancelled = false;
        this.initiated$ = false;
        this.parameters = new Map();
        this.blocks = new Map();
        this.stack = new Map();
        this.guid$ = FormImpl.id++;
        let utils = new Utils();
        this.name$ = utils.getName(form$);
    }
    get guid() {
        return (this.guid$);
    }
    get form() {
        return (this.form$);
    }
    get name() {
        return (this.name$);
    }
    set path(path) {
        this.path$ = path;
    }
    get path() {
        return (this.path$);
    }
    set title(title) {
        this.title$ = title;
    }
    get title() {
        return (this.title$);
    }
    getChain() {
        if (this.next == null)
            return (this);
        return (this.next.getChain());
    }
    initiated(done) {
        if (done != null)
            this.initiated$ = done;
        return (this.initiated$);
    }
    newForm(container) {
        let propusage = new Map();
        DatabaseDefinitions.getBlockUsage(this.name).forEach((dbusage) => { if (dbusage.usage != null)
            propusage.set(dbusage.prop, dbusage.usage); });
        let blockdef = BlockDefinitions.getBlocks(this.name);
        for (let i = 0; i < blockdef.length; i++)
            this.setDatabaseUsage(propusage, blockdef[i]);
    }
    setDatabaseUsage(propusage, blockdef) {
        let block = this.blocks.get(blockdef.alias);
        if (block != null) {
            window.alert("Block alias " + blockdef.alias + " defined twice");
            return;
        }
        if (blockdef.prop != null) {
            block = this.form[blockdef.prop];
            if (block == null && blockdef.component != null) {
                block = new blockdef.component();
                this.form[blockdef.prop] = block;
            }
        }
        else {
            if (blockdef.component != null)
                block = new blockdef.component();
        }
        if (block == null) {
            window.alert(this.name + " cannot create instance of " + blockdef.alias);
            return;
        }
        let alias = blockdef.alias;
        if (alias == null) {
            alias = block.constructor.name;
            alias = BlockDefinitions.getBlockDefaultAlias(alias);
        }
        alias = alias.toLowerCase();
        block["impl"].name = alias;
        this.blocks.set(alias, block);
        let bname = block.constructor.name;
        let usage = DatabaseDefinitions.getBlockDefault(bname);
        usage = DBUsage.merge(blockdef.databaseopts, usage);
        usage = DBUsage.merge(propusage.get(blockdef.prop), usage);
        block.setDatabaseUsage(usage);
    }
    setMenu(menu) {
        this.app.deletemenu(this.menu$);
        this.ddmenu = this.app.createmenu(menu);
        this.menu$ = menu;
    }
    getMenu() {
        return (this.menu$);
    }
    getApplication() {
        return (this.app);
    }
    setRoot(root) {
        this.root = root;
    }
    setParent(parent) {
        this.parent = parent;
    }
    setApplication(app) {
        this.app = app;
        this.menu$ = new DefaultMenu();
        this.ddmenu = app.createmenu(this.menu$);
    }
    getInstanceID() {
        return (this.inst);
    }
    setInstanceID(inst) {
        this.inst = inst;
    }
    setModalWindow(win) {
        this.win = win;
    }
    getModalWindow() {
        return (this.win);
    }
    setCallback(func) {
        this.callbackfunc = func;
    }
    setParameters(params) {
        if (params != null)
            this.parameters = params;
        else
            this.parameters = new Map();
    }
    getParameters() {
        return (this.parameters);
    }
    getDropDownMenu() {
        return (this.ddmenu);
    }
    showform(form, destroy, parameters) {
        if (this.win == null) {
            this.app.showform(form, destroy, parameters);
        }
        else {
            this.replaceform(form, destroy, parameters);
        }
    }
    replaceform(form, destroy, parameters) {
        let utils = new Utils();
        let name = utils.getName(form);
        let id = this.parent.stack.get(name);
        // newform
        if (id != null && destroy) {
            id = null;
            this.app.closeform(this, destroy);
        }
        // create
        if (id == null) {
            id = this.app.getNewInstance(form);
            this.parent.stack.set(id.name, id);
        }
        this.parent.next = id.impl;
        id.impl.setParent(this.parent);
        let inst = this.app.getInstance(id);
        this.app.preform(id.impl, parameters, inst, false);
        if (this.win != null) {
            this.win.newForm(inst);
            id.impl.setRoot(this.root);
        }
        else {
            id.impl.setRoot(this);
            this.app.showinstance(inst);
        }
    }
    callForm(form, destroy, parameters) {
        let utils = new Utils();
        let name = utils.getName(form);
        let id = this.stack.get(name);
        // newform
        if (id != null && destroy) {
            id = null;
            this.app.closeform(form, destroy);
        }
        // create
        if (id == null) {
            id = this.app.getNewInstance(form);
            this.stack.set(name, id);
        }
        this.next = id.impl;
        id.impl.setParent(this);
        let inst = this.app.getInstance(id);
        this.app.preform(id.impl, parameters, inst, false);
        if (this.win != null) {
            this.win.newForm(inst);
            id.impl.setRoot(this.root);
        }
        else {
            id.impl.setRoot(this);
            this.app.showinstance(inst);
        }
    }
    wasCancelled() {
        return (this.cancelled);
    }
    cancel() {
        this.cancelled = true;
        this.close(true);
    }
    onClose(impl, cancelled) {
        this.next = null;
        try {
            if (this.callbackfunc != null)
                this.form[this.callbackfunc.name](impl.form, cancelled);
        }
        catch (error) {
            console.log(error);
        }
        if (cancelled && this.parent != null)
            this.parent.onClose(this, cancelled);
    }
    close(destroy) {
        let win = (this.win != null);
        let menu = (this.root == null);
        let root = (this.parent == null);
        this.next = null;
        if (this.parent != null)
            this.parent.onClose(this, this.cancelled);
        if (this.cancelled) {
            this.cancelled = false;
            if (menu) {
                //chain, started from menu, was cancelled
                this.app.closeform(this, true);
            }
            else {
                //chain, started from form, was cancelled
                this.parent.stack.delete(this.name);
                this.app.closeInstance(this.inst, true);
                this.app.showTitle(this.root.title);
            }
            return;
        }
        if (!win) {
            //Normal behaivior
            this.app.closeform(this, destroy);
            return;
        }
        if (win && root) {
            //Root window
            this.app.closeform(this, destroy);
            this.win.close();
            return;
        }
        //child closed
        this.app.closeInstance(this.inst, destroy);
        if (destroy)
            this.parent.stack.delete(this.name);
        let pinst = this.parent.getInstanceID();
        this.app.showTitle(this.parent.title);
        if (pinst != null) {
            //Parent is modal
            let inst = this.app.getInstance(pinst);
            this.win.newForm(inst);
            return;
        }
        this.win.close();
    }
    getCallStack() {
        let stack = [];
        this.stack.forEach((id) => {
            stack.push(id.impl.form);
        });
        return (stack);
    }
    clearStack() {
        this.stack.forEach((id) => {
            id.impl.clearStack();
            if (id.ref != null)
                this.app.closeInstance(id, true);
        });
        this.stack.clear();
    }
    setBlock(vname, alias) {
        console.log("use " + alias + " for " + vname);
    }
}
FormImpl.id = 0;

class Form {
    // dont rename impl as it is read behind the scenes
    constructor() {
        this.impl = new FormImpl(this);
    }
    get name() {
        return (this.constructor.name);
    }
    set Title(title) {
        this.impl.title = title;
    }
    get Title() {
        return (this.impl.title);
    }
    set Menu(menu) {
        this.impl.setMenu(menu);
    }
    get Menu() {
        return (this.impl.getMenu());
    }
    newform(form, parameters) {
        this.impl.showform(form, true, parameters);
    }
    showform(form, parameters) {
        this.impl.showform(form, false, parameters);
    }
    callform(form, parameters) {
        this.impl.callForm(form, false, parameters);
    }
    getCallStack() {
        return (this.impl.getCallStack());
    }
    clearCallStack() {
        this.impl.clearStack();
    }
    get Parameters() {
        return (this.impl.getParameters());
    }
    wasCancelled() {
        return (this.impl.wasCancelled());
    }
    close(dismiss) {
        this.impl.close(dismiss);
    }
    setCallback(func) {
        this.impl.setCallback(func);
    }
    ngOnInit() {
        this.impl.getApplication().setContainer();
    }
    ngAfterViewInit() {
        let container = this.impl.getApplication().getContainer();
        this.impl.getApplication().dropContainer();
        this.impl.newForm(container);
    }
}
Form.ɵfac = function Form_Factory(t) { return new (t || Form)(); };
Form.ɵcmp = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"])({ type: Form, selectors: [["ng-component"]], decls: 0, vars: 0, template: function Form_Template(rf, ctx) { }, encapsulation: 2 });
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(Form, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{ template: '' }]
    }], function () { return []; }, null); })();

class FormUtil {
    constructor() {
        this.utils = new Utils();
    }
    complete(options, create) {
        if (options == null) {
            if (create)
                options = {};
            else
                return (null);
        }
        if (!options.hasOwnProperty("wizard"))
            options.wizard = false;
        if (!options.hasOwnProperty("inherit"))
            options.inherit = true;
        if (!options.hasOwnProperty("width"))
            options.width = "99.65vw";
        if (!options.hasOwnProperty("height"))
            options.height = "99.5vh";
        if (!options.hasOwnProperty("offsetTop"))
            options.offsetTop = "0";
        if (!options.hasOwnProperty("offsetLeft"))
            options.offsetLeft = "0";
        return (options);
    }
    convert(form) {
        let fname = this.utils.getName(form.component);
        let navigable = true;
        form.windowopts = this.complete(form.windowopts);
        if (form.hasOwnProperty("navigable"))
            navigable = form.navigable;
        let path = "/" + fname;
        if (form.hasOwnProperty("path"))
            path = form.path;
        path = path.trim();
        if (!path.startsWith("/"))
            path = "/" + path;
        let def = {
            name: fname,
            path: form.path,
            title: form.title,
            navigable: navigable,
            component: form.component,
            windowdef: form.windowopts
        };
        return (def);
    }
    clone(base) {
        let clone = {
            name: base.name,
            path: base.path,
            title: base.title,
            windowdef: base.windowdef,
            windowopts: base.windowdef,
            component: base.component,
            navigable: base.navigable
        };
        return (clone);
    }
}

const _c0$1 = ["menu"];
const _c1 = ["window"];
const _c2 = ["topbar"];
const _c3 = ["content"];
class ModalWindow {
    constructor(change) {
        this.change = change;
        this.top = "";
        this.left = "";
        this.width = "99vw";
        this.height = "98vh";
        this.tmargin = "1vh";
        this.preferences = new Preferences();
        this.minw = 0;
        this.minh = 0;
        this.offx = 0;
        this.offy = 0;
        this.move = false;
        this.resz = false;
        this.resizex = false;
        this.resizey = false;
    }
    get tcolor() {
        return (this.preferences.colors.title);
    }
    get bcolor() {
        return (this.preferences.colors.topbar);
    }
    get btncolor() {
        return (this.preferences.colors.buttontext);
    }
    setForm(form) {
        this.resize(form, true);
        let impl = form.formref.instance["impl"];
        impl.setModalWindow(this);
        this.form = form;
    }
    getForm() {
        return (this.form.formref.instance);
    }
    newForm(form) {
        var _a;
        if (!((_a = form.windowopts) === null || _a === void 0 ? void 0 : _a.inherit))
            this.resize(form, false);
        let formelem = this.content.firstElementChild;
        if (formelem != null)
            this.content.removeChild(formelem);
        this.app.builder.getAppRef().detachView(this.form.formref.hostView);
        if (this.menuelem != null) {
            let menuelem = this.menu.firstElementChild;
            if (menuelem != null)
                this.menu.removeChild(this.menuelem);
            this.app.builder.getAppRef().detachView(this.menuref.hostView);
        }
        let impl = form.formref.instance["impl"];
        impl.setModalWindow(this);
        this.form = form;
        this.display();
    }
    setWinRef(winref) {
        this.winref = winref;
    }
    setApplication(app) {
        this.app = app;
    }
    close() {
        let impl = this.form.formref.instance["impl"];
        this.closeWindow();
        impl.cancel();
    }
    closeWindow() {
        Listener.remove("modal", "mouseup");
        Listener.remove("modal", "mousemove");
        Listener.remove("modal", "mousedown");
        let formelem = this.content.firstElementChild;
        if (formelem != null)
            this.content.removeChild(formelem);
        this.app.builder.getAppRef().detachView(this.form.formref.hostView);
        let element = this.winref.hostView.rootNodes[0];
        document.body.removeChild(element);
        this.app.builder.getAppRef().detachView(this.winref.hostView);
        this.winref.destroy();
        this.winref = null;
    }
    resize(form, pos) {
        if (pos) {
            this.top = form.windowopts.offsetTop;
            this.left = form.windowopts.offsetLeft;
        }
        this.width = form.windowopts.width;
        this.height = form.windowopts.height;
        if (form.windowopts.width == "") {
            this.left = "0";
            this.width = "100%";
        }
        if (form.windowopts.height == "") {
            this.top = "0";
            this.height = "100%";
        }
    }
    display() {
        if (this.form == null) {
            setTimeout(() => { this.display(); }, 10);
            return;
        }
        this.element = this.form.formref.hostView.rootNodes[0];
        this.app.builder.getAppRef().attachView(this.form.formref.hostView);
        this.content.appendChild(this.element);
        this.minh = 100;
        this.minw = 450;
        this.showmenu();
        this.change.detectChanges();
        this.posy = this.window.offsetTop;
        this.posx = this.window.offsetLeft;
        this.sizex = this.window.offsetWidth;
        this.sizey = this.window.offsetHeight;
        let resize = false;
        if (this.sizex < this.minw) {
            resize = true;
            this.sizex = this.minw;
            this.width = this.sizex + "px";
        }
        if (this.sizey < this.minh) {
            resize = true;
            this.sizey = this.minh;
            this.height = this.sizey + "px";
        }
        if (resize)
            this.change.detectChanges();
    }
    showmenu() {
        let impl = this.form.formref.instance["impl"];
        this.menuelem = null;
        this.menuref = impl.getDropDownMenu();
        if (this.menuref == null)
            return;
        this.menuelem = this.menuref.hostView.rootNodes[0];
        this.app.builder.getAppRef().attachView(this.menuref.hostView);
        this.menu.appendChild(this.menuelem);
        let ddmenu = this.menuref.instance;
        this.initmenu(ddmenu);
    }
    initmenu(ddmenu) {
        if (ddmenu.getMenu() == null) {
            setTimeout(() => { this.initmenu(ddmenu); }, 10);
            return;
        }
        let impl = this.form.formref.instance["impl"];
        ddmenu.getMenu().getHandler().onFormChange(impl.form);
        this.minw = this.menu.clientWidth + 50;
        if (this.sizex < this.minw) {
            this.sizex = this.minw;
            this.width = this.sizex + "px";
            this.change.detectChanges();
        }
    }
    ngAfterViewInit() {
        var _a, _b, _c, _d;
        this.menu = (_a = this.menuElement) === null || _a === void 0 ? void 0 : _a.nativeElement;
        this.window = (_b = this.windowElement) === null || _b === void 0 ? void 0 : _b.nativeElement;
        this.topbar = (_c = this.topbarElement) === null || _c === void 0 ? void 0 : _c.nativeElement;
        this.content = (_d = this.contentElement) === null || _d === void 0 ? void 0 : _d.nativeElement;
        this.display();
        Listener.add("modal", this, "mouseup");
        Listener.add("modal", this, "mousemove");
        Listener.add("modal", this, "mousedown");
        this.topbar.addEventListener("mousedown", (event) => { this.startmove(event); });
    }
    onEvent(event) {
        switch (event.type) {
            case "mouseup":
                this.mouseup();
                break;
            case "mousemove":
                this.movePopup(event);
                this.resizePopup(event);
                this.resizemousemove(event);
                break;
            case "mousedown":
                this.startresize(event);
                break;
        }
    }
    startmove(event) {
        if (this.resizexy)
            return;
        this.move = true;
        event = event || window.event;
        event.preventDefault();
        this.offy = +event.clientY - this.posy;
        this.offx = +event.clientX - this.posx;
    }
    mouseup() {
        if (!this.move && !this.resz)
            return;
        this.move = false;
        this.resz = false;
        this.resizexy = false;
        this.window.style.cursor = "default";
        document.body.style.cursor = "default";
    }
    movePopup(event) {
        if (!this.move)
            return;
        event = event || window.event;
        let deltay = +event.clientY - this.posy;
        let deltax = +event.clientX - this.posx;
        this.posy += (deltay - this.offy);
        this.posx += (deltax - this.offx);
        if (this.posy > 0)
            this.top = this.posy + "px";
        if (this.posx > 0)
            this.left = this.posx + "px";
        this.change.detectChanges();
    }
    resizemousemove(event) {
        if (this.resz)
            return;
        event = event || window.event;
        let posx = +event.clientX;
        let posy = +event.clientY;
        let offx = this.posx + this.sizex - posx;
        let offy = this.posy + this.sizey - posy;
        let before = false;
        if (this.resizex || this.resizey)
            before = true;
        this.resizex = false;
        this.resizey = false;
        if (offx > -7 && offx < 10 && posy > this.posy - 7 && posy < this.posy + this.sizey + 7)
            this.resizex = true;
        if (offy > -7 && offy < 10 && posx > this.posx - 7 && posx < this.posx + this.sizex + 7)
            this.resizey = true;
        if (this.resizex && this.resizey) {
            this.resizex = true;
            this.resizey = true;
        }
        if (this.resizex && !this.resizey) {
            this.window.style.cursor = "e-resize";
            document.body.style.cursor = "e-resize";
        }
        if (this.resizey && !this.resizex) {
            this.window.style.cursor = "s-resize";
            document.body.style.cursor = "s-resize";
        }
        if (this.resizex && this.resizey) {
            this.window.style.cursor = "se-resize";
            document.body.style.cursor = "se-resize";
        }
        if (before && !this.resizexy) {
            this.window.style.cursor = "default";
            document.body.style.cursor = "default";
        }
    }
    startresize(event) {
        if (!this.resizexy)
            return;
        this.resz = true;
        event = event || window.event;
        event.preventDefault();
        this.offy = +event.clientY;
        this.offx = +event.clientX;
    }
    resizePopup(event) {
        if (!this.resz)
            return;
        event = event || window.event;
        let deltay = +event.clientY - this.offy;
        let deltax = +event.clientX - this.offx;
        if (this.resizex && (this.sizex > this.minw || deltax > 0)) {
            this.sizex += deltax;
            this.width = this.sizex + "px";
        }
        if (this.resizey && (this.sizey > this.minh || deltay > 0)) {
            this.sizey += deltay;
            this.height = this.sizey + "px";
        }
        this.offy = +event.clientY;
        this.offx = +event.clientX;
        this.change.detectChanges();
    }
    get resizexy() {
        if (this.resizex || this.resizey)
            return (true);
        return (false);
    }
    set resizexy(on) {
        this.resizex = on;
        this.resizey = on;
    }
}
ModalWindow.ɵfac = function ModalWindow_Factory(t) { return new (t || ModalWindow)(Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"])(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"])); };
ModalWindow.ɵcmp = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"])({ type: ModalWindow, selectors: [["modalwindow"]], viewQuery: function ModalWindow_Query(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c0$1, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c1, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c2, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c3, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
    } if (rf & 2) {
        var _t;
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.menuElement = _t.first);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.windowElement = _t.first);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.topbarElement = _t.first);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.contentElement = _t.first);
    } }, decls: 16, vars: 21, consts: [[1, "modalwindow"], [1, "modalwindow-modal-block"], ["window", ""], [1, "modalwindow-container"], [1, "modalwindow-topbar"], ["topbar", ""], [1, "modalwindow-center"], [1, "modalwindow-corner"], ["menu", ""], [1, "modalwindow-close"], [1, "modalwindow-button", 3, "click"], [1, "modalwindow-block"], ["content", ""]], template: function ModalWindow_Template(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(0, "div", 0);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(1, "div", 1, 2);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(3, "div", 3);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(4, "div", 4, 5);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(6, "span", 6);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(7, "span", 7);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(8, "div", null, 8);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(10, "span", 9);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(11, "button", 10);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"])("click", function ModalWindow_Template_button_click_11_listener() { return ctx.close(); });
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"])(12, "X");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(13, "div", 11);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(14, "div", null, 12);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
    } if (rf & 2) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(1);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate2"])("top: ", ctx.top, "; left: ", ctx.left, "");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(2);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate2"])("width: ", ctx.width, "; height: ", ctx.height, ";");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(1);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate2"])("color: ", ctx.tcolor, "; background-color: ", ctx.bcolor, "");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(2);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate1"])("color: ", ctx.tcolor, ";");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(5);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate1"])("color: ", ctx.btncolor, ";");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(2);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate1"])("margin-top: ", ctx.tmargin, ";");
    } }, styles: [".modalwindow[_ngcontent-%COMP%]\n    {\n        top: 0;\n        left: 0;\n        z-index: 1;\n        width: 100%;\n        height: 100%;\n        display: block;\n        overflow: auto;\n        position: fixed;\n    }\n\n    .modalwindow-modal-block[_ngcontent-%COMP%]\n    {\n      position: absolute;\n      background-color: #fefefe;\n    }\n\n    .modalwindow-container[_ngcontent-%COMP%]\n    {\n        position: relative;\n        border: 2px solid black;\n    }\n\n    .modalwindow-topbar[_ngcontent-%COMP%]\n    {\n        height: 1.70em;\n        margin-left: 0;\n        margin-right: 0;\n        cursor:default;\n\t\tjustify-content: center;\n        border-bottom: 2px solid black;\n    }\n\n\t.modalwindow-corner[_ngcontent-%COMP%]\n\t{\n\t\twidth: 2.5em;\n\t\tdisplay: block;\n\t\tposition: relative;\n\t}\n\n\t.modalwindow-close[_ngcontent-%COMP%]\n\t{\n\t\ttop: 0;\n\t\tright: 0;\n\t\twidth: 1.75em;\n\t\theight: 1.70em;\n\t\tposition: absolute;\n\t\tborder-left: 1px solid black;\n\t}\n\n\t.modalwindow-button[_ngcontent-%COMP%]\n\t{\n\t\ttop: 50%;\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\toutline:none;\n\t\tfont-size: 0.75em;\n\t\tfont-weight: bold;\n\t\tposition: relative;\n\t\tbackground: transparent;\n\t\ttransform: translateY(-50%);\n\t\tborder: 0px solid transparent;\n\t\tbox-shadow: 0px 0px 0px transparent;\n\t\ttext-shadow: 0px 0px 0px transparent;\n\t}\n\n\t.modalwindow-center[_ngcontent-%COMP%]\n\t{\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\twidth: 93%;\n\t\theight: 100%;\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tjustify-content: center;\n\t}\n\n    .modalwindow-block[_ngcontent-%COMP%]\n    {\n        left: 0;\n        top: 3vh;\n        right: 0;\n        bottom: 0;\n\t\tdisplay: flex;\n        overflow: auto;\n        position: absolute;\n\t\tjustify-content: center;\n    }"], changeDetection: 0 });
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(ModalWindow, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'modalwindow',
                template: `
    <div class="modalwindow">
      <div #window class="modalwindow-modal-block" style="top: {{top}}; left: {{left}}">
        <div class="modalwindow-container" style="width: {{width}}; height: {{height}};">
		  <div #topbar class="modalwindow-topbar" style="color: {{tcolor}}; background-color: {{bcolor}}">
		    <span class="modalwindow-center" style="color: {{tcolor}};">
				<span class="modalwindow-corner"></span>
				<div #menu></div>
				<span class="modalwindow-close">
					<button class="modalwindow-button" style="color: {{btncolor}};" (click)="close()">X</button>
				</span>
			</span>
		  </div>
          <div class="modalwindow-block" style="margin-top: {{tmargin}};"><div #content></div></div>
        </div>
      </div>
    </div>
  `,
                styles: [`
    .modalwindow
    {
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: block;
        overflow: auto;
        position: fixed;
    }

    .modalwindow-modal-block
    {
      position: absolute;
      background-color: #fefefe;
    }

    .modalwindow-container
    {
        position: relative;
        border: 2px solid black;
    }

    .modalwindow-topbar
    {
        height: 1.70em;
        margin-left: 0;
        margin-right: 0;
        cursor:default;
		justify-content: center;
        border-bottom: 2px solid black;
    }

	.modalwindow-corner
	{
		width: 2.5em;
		display: block;
		position: relative;
	}

	.modalwindow-close
	{
		top: 0;
		right: 0;
		width: 1.75em;
		height: 1.70em;
		position: absolute;
		border-left: 1px solid black;
	}

	.modalwindow-button
	{
		top: 50%;
		width: 100%;
		height: 100%;
		outline:none;
		font-size: 0.75em;
		font-weight: bold;
		position: relative;
		background: transparent;
		transform: translateY(-50%);
		border: 0px solid transparent;
		box-shadow: 0px 0px 0px transparent;
		text-shadow: 0px 0px 0px transparent;
	}

	.modalwindow-center
	{
		top: 0;
		bottom: 0;
		width: 93%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

    .modalwindow-block
    {
        left: 0;
        top: 3vh;
        right: 0;
        bottom: 0;
		display: flex;
        overflow: auto;
        position: absolute;
		justify-content: center;
    }
`],
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"] }]; }, { menuElement: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["menu", { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }], windowElement: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["window", { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }], topbarElement: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["topbar", { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }], contentElement: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['content', { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }] }); })();

class FormsControl {
    constructor(app, builder) {
        this.app = app;
        this.builder = builder;
        this.utils = new Utils();
        this.formlist = [];
        this.forms = new Map();
    }
    setFormArea(formarea) {
        this.formarea = formarea;
    }
    setFormsDefinitions(forms) {
        let futil = new FormUtil();
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            let def = futil.convert(form);
            this.formlist.push(def);
            this.forms.set(def.name, def);
        }
        return (this.forms);
    }
    findFormByPath(path) {
        for (let i = 0; i < this.formlist.length; i++) {
            if (this.formlist[i].path == path)
                return (this.formlist[i].name);
        }
        return (null);
    }
    getFormsList() {
        return (this.formlist);
    }
    getFormsDefinitions() {
        return (this.forms);
    }
    closeform(form, destroy) {
        let name = this.utils.getName(form);
        let formdef = this.forms.get(name);
        if (formdef == null || formdef.formref == null)
            return;
        this.close(formdef, destroy);
    }
    close(formdef, destroy) {
        if (formdef.formref == null)
            return;
        let formsarea = this.formarea.getFormsArea();
        let element = formdef.formref.hostView.rootNodes[0];
        if (this.current != null && this.current.element == element) {
            this.current = null;
            formsarea.removeChild(element);
            this.builder.getAppRef().detachView(formdef.formref.hostView);
        }
        if (destroy) {
            formdef.formref.destroy();
            formdef.windowopts = null;
            formdef.formref = null;
        }
    }
    display(formdef) {
        if (formdef == null || formdef.formref == null)
            return;
        let formsarea = this.formarea.getFormsArea();
        let element = formdef.formref.hostView.rootNodes[0];
        let impl = formdef.formref.instance["impl"];
        if (formdef.windowopts == null) {
            this.current = { formdef: formdef, element: element };
            this.builder.getAppRef().attachView(formdef.formref.hostView);
            formsarea.appendChild(element);
        }
        else {
            let id = {
                impl: impl,
                ref: formdef.formref,
                name: formdef.name,
                modalopts: formdef.windowopts
            };
            impl.setInstanceID(id);
            let win = this.createWindow();
            win.setForm(formdef);
            win.setApplication(this.app);
        }
    }
    createWindow() {
        let winref = this.app.builder.createComponent(ModalWindow);
        let win = winref.instance;
        win.setWinRef(winref);
        let element = winref.hostView.rootNodes[0];
        this.builder.getAppRef().attachView(winref.hostView);
        document.body.appendChild(element);
        return (win);
    }
    getFormInstance(form) {
        let name = this.utils.getName(form);
        let formdef = this.forms.get(name);
        if (formdef == null)
            return (null);
        if (formdef.formref == null) {
            formdef.formref = this.createForm(formdef.component);
            if (formdef.windowdef != null && formdef.windowdef.wizard)
                formdef.windowopts = formdef.windowdef;
        }
        return (formdef);
    }
    createForm(component) {
        let ref = this.builder.createComponent(component);
        if (!(ref.instance instanceof Form)) {
            let name = ref.instance.constructor.name;
            window.alert("Component " + name + " is not an instance of Form");
            return;
        }
        let impl = ref.instance["impl"];
        impl.setApplication(this.app);
        return (ref);
    }
}

class LoginForm {
    constructor() {
        this.top = "20%";
        this.left = "25%";
        this.width = "300px";
        this.height = "150px";
        this.title = "Login";
    }
    setWin(win) {
        this.win = win;
    }
    setApp(app) {
        this.app = app;
    }
    close(cancel) {
    }
    ngOnInit() {
        this.app.setContainer();
    }
    ngAfterViewInit() {
        let container = this.app.getContainer();
        this.usr = container.components[0];
        this.pwd = container.components[1];
        this.usr.type = "input";
        this.pwd.type = "password";
        this.app.dropContainer();
    }
}
LoginForm.ɵfac = function LoginForm_Factory(t) { return new (t || LoginForm)(); };
LoginForm.ɵcmp = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"])({ type: LoginForm, selectors: [["ng-component"]], decls: 13, vars: 0, consts: [[2, "margin-top", "20px"], ["name", "usr", 2, "width", "100px"], ["name", "pwd", 2, "width", "200px"]], template: function LoginForm_Template(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(0, "table", 0);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(1, "tr");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(2, "td");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"])(3, "Username");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(4, "td");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"])(5, ": ");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(6, "field", 1);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(7, "tr");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(8, "td");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"])(9, "Password");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(10, "td");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"])(11, ": ");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(12, "field", 2);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
    } }, encapsulation: 2 });
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(LoginForm, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: '',
                template: `
        <table style='margin-top: 20px'>
          <tr>
            <td>Username</td><td>: <field style='width: 100px' name='usr'></field> </td>
          </tr>
          <tr>
            <td>Password</td><td>: <field style='width: 200px' name='pwd'></field> </td>
          </tr>
        </table>
    `
            }]
    }], null, null); })();

class Connection {
    connect(usr, pwd) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_1__["__awaiter"])(this, void 0, void 0, function* () {
            //let promise:Promise<any> = this.sleep(2000);
            //promise.then((arg) => {console.log("promise done "+arg)}, () => {console.log("error")});
            return (true);
        });
    }
    disconnect() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_1__["__awaiter"])(this, void 0, void 0, function* () {
            return (true);
        });
    }
}

const _c0$2 = ["title"];
const _c1$1 = ["window"];
const _c2$1 = ["topbar"];
const _c3$1 = ["content"];
class PopupWindow {
    constructor(change) {
        this.change = change;
        this.top = "5vh";
        this.left = "10vw";
        this.width = "40vw";
        this.height = "30vh";
        this.tmargin = "1vh";
        this.preferences = new Preferences();
        this.minw = 0;
        this.minh = 0;
        this.offx = 0;
        this.offy = 0;
        this.move = false;
        this.resz = false;
        this.resizex = false;
        this.resizey = false;
    }
    get tcolor() {
        return (this.preferences.colors.title);
    }
    get bcolor() {
        return (this.preferences.colors.topbar);
    }
    get btncolor() {
        return (this.preferences.colors.buttontext);
    }
    setApp(app) {
        this.app = app;
    }
    setPopup(pinst) {
        this.pinst = pinst;
        this.popup = pinst.popupref.instance;
        this.popup.setWin(this);
        this.title = this.popup.title;
        if (this.popup.hasOwnProperty("top"))
            this.top = this.popup.top;
        if (this.popup.hasOwnProperty("left"))
            this.left = this.popup.left;
        if (this.popup.hasOwnProperty("width"))
            this.width = this.popup.width;
        if (this.popup.hasOwnProperty("height"))
            this.height = this.popup.height;
    }
    setWinRef(winref) {
        this.winref = winref;
    }
    close(cancel) {
        Listener.remove("modal", "mouseup");
        Listener.remove("modal", "mousemove");
        Listener.remove("modal", "mousedown");
        let formelem = this.content.firstElementChild;
        if (formelem != null)
            this.content.removeChild(formelem);
        this.app.builder.getAppRef().detachView(this.pinst.popupref.hostView);
        let element = this.winref.hostView.rootNodes[0];
        document.body.removeChild(element);
        this.app.builder.getAppRef().detachView(this.winref.hostView);
        this.winref.destroy();
        this.winref = null;
        this.popup.close(cancel);
    }
    display() {
        if (this.pinst == null) {
            setTimeout(() => { this.display(); }, 10);
            return;
        }
        this.element = this.pinst.popupref.hostView.rootNodes[0];
        this.app.builder.getAppRef().attachView(this.pinst.popupref.hostView);
        this.content.appendChild(this.element);
        this.minh = 150;
        this.minw = 300;
        this.titlebar.innerHTML = this.title;
        this.change.detectChanges();
        this.posy = this.window.offsetTop;
        this.posx = this.window.offsetLeft;
        this.sizex = this.window.offsetWidth;
        this.sizey = this.window.offsetHeight;
        let resize = false;
        if (this.sizex < this.minw) {
            resize = true;
            this.sizex = this.minw;
            this.width = this.sizex + "px";
        }
        if (this.sizey < this.minh) {
            resize = true;
            this.sizey = this.minh;
            this.height = this.sizey + "px";
        }
        if (resize)
            this.change.detectChanges();
    }
    ngAfterViewInit() {
        var _a, _b, _c, _d;
        this.window = (_a = this.windowElement) === null || _a === void 0 ? void 0 : _a.nativeElement;
        this.topbar = (_b = this.topbarElement) === null || _b === void 0 ? void 0 : _b.nativeElement;
        this.content = (_c = this.contentElement) === null || _c === void 0 ? void 0 : _c.nativeElement;
        this.titlebar = (_d = this.titlebarElement) === null || _d === void 0 ? void 0 : _d.nativeElement;
        this.display();
        Listener.add("modal", this, "mouseup");
        Listener.add("modal", this, "mousemove");
        Listener.add("modal", this, "mousedown");
        this.topbar.addEventListener("mousedown", (event) => { this.startmove(event); });
    }
    onEvent(event) {
        switch (event.type) {
            case "mouseup":
                this.mouseup();
                break;
            case "mousemove":
                this.movePopup(event);
                this.resizePopup(event);
                this.resizemousemove(event);
                break;
            case "mousedown":
                this.startresize(event);
                break;
        }
    }
    startmove(event) {
        if (this.resizexy)
            return;
        this.move = true;
        event = event || window.event;
        event.preventDefault();
        this.offy = +event.clientY - this.posy;
        this.offx = +event.clientX - this.posx;
    }
    mouseup() {
        if (!this.move && !this.resz)
            return;
        this.move = false;
        this.resz = false;
        this.resizexy = false;
        this.window.style.cursor = "default";
        document.body.style.cursor = "default";
    }
    movePopup(event) {
        if (!this.move)
            return;
        event = event || window.event;
        let deltay = +event.clientY - this.posy;
        let deltax = +event.clientX - this.posx;
        this.posy += (deltay - this.offy);
        this.posx += (deltax - this.offx);
        if (this.posy > 0)
            this.top = this.posy + "px";
        if (this.posx > 0)
            this.left = this.posx + "px";
        this.change.detectChanges();
    }
    resizemousemove(event) {
        if (this.resz)
            return;
        event = event || window.event;
        let posx = +event.clientX;
        let posy = +event.clientY;
        let offx = this.posx + this.sizex - posx;
        let offy = this.posy + this.sizey - posy;
        let before = false;
        if (this.resizex || this.resizey)
            before = true;
        this.resizex = false;
        this.resizey = false;
        if (offx > -7 && offx < 10 && posy > this.posy - 7 && posy < this.posy + this.sizey + 7)
            this.resizex = true;
        if (offy > -7 && offy < 10 && posx > this.posx - 7 && posx < this.posx + this.sizex + 7)
            this.resizey = true;
        if (this.resizex && this.resizey) {
            this.resizex = true;
            this.resizey = true;
        }
        if (this.resizex && !this.resizey) {
            this.window.style.cursor = "e-resize";
            document.body.style.cursor = "e-resize";
        }
        if (this.resizey && !this.resizex) {
            this.window.style.cursor = "s-resize";
            document.body.style.cursor = "s-resize";
        }
        if (this.resizex && this.resizey) {
            this.window.style.cursor = "se-resize";
            document.body.style.cursor = "se-resize";
        }
        if (before && !this.resizexy) {
            this.window.style.cursor = "default";
            document.body.style.cursor = "default";
        }
    }
    startresize(event) {
        if (!this.resizexy)
            return;
        this.resz = true;
        event = event || window.event;
        event.preventDefault();
        this.offy = +event.clientY;
        this.offx = +event.clientX;
    }
    resizePopup(event) {
        if (!this.resz)
            return;
        event = event || window.event;
        let deltay = +event.clientY - this.offy;
        let deltax = +event.clientX - this.offx;
        if (this.resizex && (this.sizex > this.minw || deltax > 0)) {
            this.sizex += deltax;
            this.width = this.sizex + "px";
        }
        if (this.resizey && (this.sizey > this.minh || deltay > 0)) {
            this.sizey += deltay;
            this.height = this.sizey + "px";
        }
        this.offy = +event.clientY;
        this.offx = +event.clientX;
        this.change.detectChanges();
    }
    get resizexy() {
        if (this.resizex || this.resizey)
            return (true);
        return (false);
    }
    set resizexy(on) {
        this.resizex = on;
        this.resizey = on;
    }
}
PopupWindow.ɵfac = function PopupWindow_Factory(t) { return new (t || PopupWindow)(Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"])(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"])); };
PopupWindow.ɵcmp = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"])({ type: PopupWindow, selectors: [["popupwindow"]], viewQuery: function PopupWindow_Query(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c0$2, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c1$1, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c2$1, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c3$1, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
    } if (rf & 2) {
        var _t;
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.titlebarElement = _t.first);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.windowElement = _t.first);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.topbarElement = _t.first);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.contentElement = _t.first);
    } }, decls: 16, vars: 21, consts: [[1, "popupwindow"], [1, "popupwindow-modal-block"], ["window", ""], [1, "popupwindow-container"], [1, "popupwindow-topbar"], ["topbar", ""], [1, "popupwindow-center"], [1, "popupwindow-corner"], ["title", ""], [1, "popupwindow-close"], [1, "popupwindow-button", 3, "click"], [1, "popupwindow-block"], ["content", ""]], template: function PopupWindow_Template(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(0, "div", 0);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(1, "div", 1, 2);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(3, "div", 3);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(4, "div", 4, 5);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(6, "span", 6);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(7, "span", 7);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(8, "div", null, 8);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(10, "span", 9);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(11, "button", 10);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"])("click", function PopupWindow_Template_button_click_11_listener() { return ctx.close(true); });
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"])(12, "X");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"])(13, "div", 11);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(14, "div", null, 12);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"])();
    } if (rf & 2) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(1);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate2"])("top: ", ctx.top, "; left: ", ctx.left, "");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(2);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate2"])("width: ", ctx.width, "; height: ", ctx.height, ";");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(1);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate2"])("color: ", ctx.tcolor, "; background-color: ", ctx.bcolor, "");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(2);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate1"])("color: ", ctx.tcolor, ";");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(5);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate1"])("color: ", ctx.btncolor, ";");
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"])(2);
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMapInterpolate1"])("margin-top: ", ctx.tmargin, ";");
    } }, styles: [".popupwindow[_ngcontent-%COMP%]\n    {\n        top: 0;\n        left: 0;\n        z-index: 1;\n        width: 100%;\n        height: 100%;\n        display: block;\n        overflow: auto;\n        position: fixed;\n    }\n\n    .popupwindow-modal-block[_ngcontent-%COMP%]\n    {\n      position: absolute;\n      background-color: #fefefe;\n    }\n\n    .popupwindow-container[_ngcontent-%COMP%]\n    {\n        position: relative;\n        border: 2px solid black;\n    }\n\n    .popupwindow-topbar[_ngcontent-%COMP%]\n    {\n        height: 1.70em;\n        margin-left: 0;\n        margin-right: 0;\n        cursor:default;\n\t\tjustify-content: center;\n        border-bottom: 2px solid black;\n    }\n\n\t.popupwindow-corner[_ngcontent-%COMP%]\n\t{\n\t\twidth: 1.5em;\n\t\tdisplay: block;\n\t\tposition: relative;\n\t}\n\n\t.popupwindow-close[_ngcontent-%COMP%]\n\t{\n\t\ttop: 0;\n\t\tright: 0;\n\t\twidth: 1.75em;\n\t\theight: 1.70em;\n\t\tposition: absolute;\n\t\tborder-left: 1px solid black;\n\t}\n\n\t.popupwindow-button[_ngcontent-%COMP%]\n\t{\n\t\ttop: 50%;\n\t\twidth: 100%;\n\t\theight: 100%;\n\t\toutline:none;\n\t\tfont-size: 0.75em;\n\t\tfont-weight: bold;\n\t\tposition: relative;\n\t\tbackground: transparent;\n\t\ttransform: translateY(-50%);\n\t\tborder: 0px solid transparent;\n\t\tbox-shadow: 0px 0px 0px transparent;\n\t\ttext-shadow: 0px 0px 0px transparent;\n\t}\n\n\t.popupwindow-center[_ngcontent-%COMP%]\n\t{\n\t\ttop: 0;\n\t\tbottom: 0;\n\t\twidth: 93%;\n\t\theight: 100%;\n\t\tdisplay: flex;\n\t\talign-items: center;\n\t\tjustify-content: center;\n\t}\n\n    .popupwindow-block[_ngcontent-%COMP%]\n    {\n        left: 0;\n        top: 3vh;\n        right: 0;\n        bottom: 0;\n\t\tdisplay: flex;\n        overflow: auto;\n        position: absolute;\n\t\tjustify-content: center;\n    }"], changeDetection: 0 });
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(PopupWindow, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'popupwindow',
                template: `
    <div class="popupwindow">
      <div #window class="popupwindow-modal-block" style="top: {{top}}; left: {{left}}">
        <div class="popupwindow-container" style="width: {{width}}; height: {{height}};">
		  <div #topbar class="popupwindow-topbar" style="color: {{tcolor}}; background-color: {{bcolor}}">
		    <span class="popupwindow-center" style="color: {{tcolor}};">
				<span class="popupwindow-corner"></span>
				<div #title></div>
                <span class="popupwindow-close">
                    <button class="popupwindow-button" style="color: {{btncolor}};" (click)="close(true)">X</button>
                </span>
			</span>
		   </div>
          <div class="popupwindow-block" style="margin-top: {{tmargin}};"><div #content></div></div>
        </div>
      </div>
    </div>
  `,
                styles: [`
    .popupwindow
    {
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: block;
        overflow: auto;
        position: fixed;
    }

    .popupwindow-modal-block
    {
      position: absolute;
      background-color: #fefefe;
    }

    .popupwindow-container
    {
        position: relative;
        border: 2px solid black;
    }

    .popupwindow-topbar
    {
        height: 1.70em;
        margin-left: 0;
        margin-right: 0;
        cursor:default;
		justify-content: center;
        border-bottom: 2px solid black;
    }

	.popupwindow-corner
	{
		width: 1.5em;
		display: block;
		position: relative;
	}

	.popupwindow-close
	{
		top: 0;
		right: 0;
		width: 1.75em;
		height: 1.70em;
		position: absolute;
		border-left: 1px solid black;
	}

	.popupwindow-button
	{
		top: 50%;
		width: 100%;
		height: 100%;
		outline:none;
		font-size: 0.75em;
		font-weight: bold;
		position: relative;
		background: transparent;
		transform: translateY(-50%);
		border: 0px solid transparent;
		box-shadow: 0px 0px 0px transparent;
		text-shadow: 0px 0px 0px transparent;
	}

	.popupwindow-center
	{
		top: 0;
		bottom: 0;
		width: 93%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

    .popupwindow-block
    {
        left: 0;
        top: 3vh;
        right: 0;
        bottom: 0;
		display: flex;
        overflow: auto;
        position: absolute;
		justify-content: center;
    }
`],
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"] }]; }, { titlebarElement: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["title", { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }], windowElement: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["window", { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }], topbarElement: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["topbar", { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }], contentElement: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['content', { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }] }); })();

class PopupInstance {
    display(app, popup) {
        this.popupref = app.builder.createComponent(popup);
        this.popupref.instance.setApp(app);
        let winref = app.builder.createComponent(PopupWindow);
        let win = winref.instance;
        win.setApp(app);
        win.setPopup(this);
        win.setWinRef(winref);
        let element = winref.hostView.rootNodes[0];
        app.builder.getAppRef().attachView(winref.hostView);
        document.body.appendChild(element);
    }
}

class ApplicationState {
    constructor(app) {
        this.app = app;
        this.menu = null;
        this.form = null;
        this.appmenu = null;
        this.forms = new Map();
        this.menus = new Map();
        this.conn = false;
        this.menu = new DefaultMenu();
        this.connection = new Connection();
    }
    addForm(form) {
        this.forms.set(form.guid, form);
    }
    dropForm(form) {
        this.forms.delete(form.guid);
    }
    addMenu(menu) {
        let mhdl = menu.getHandler();
        this.menus.set(mhdl.guid, mhdl);
    }
    dropMenu(menu) {
        let mhdl = menu.getHandler();
        this.menus.delete(mhdl.guid);
    }
    connect(usr, pwd) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_1__["__awaiter"])(this, void 0, void 0, function* () {
            let pinst = new PopupInstance();
            pinst.display(this.app, LoginForm);
            this.conn = true;
            this.connection.connect(usr, pwd);
            this.menus.forEach((mhdl) => { mhdl.onConnect(); });
            return (true);
        });
    }
    disconnect() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_1__["__awaiter"])(this, void 0, void 0, function* () {
            this.conn = false;
            this.menus.forEach((mhdl) => { mhdl.onDisconnect(); });
            return (true);
        });
    }
    connected() {
        return (this.conn);
    }
}

class InstanceControl {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this.utils = new Utils();
        this.futil = new FormUtil();
    }
    setFormsDefinitions(forms) {
        this.forms = forms;
    }
    getNewInstance(form, modal) {
        let name = this.utils.getName(form);
        if (name == null)
            return (null);
        let def = this.forms.get(name);
        if (def == null)
            return (null);
        let ref = this.ctrl.createForm(def.component);
        if (ref == null)
            return (null);
        let impl = ref.instance["impl"];
        if (modal == null)
            modal = def.windowdef;
        modal = this.futil.complete(modal, true);
        let id = {
            ref: ref,
            impl: impl,
            name: def.name,
            modalopts: modal
        };
        impl.setInstanceID(id);
        return (id);
    }
    getInstance(id) {
        let def = this.forms.get(id.name);
        let instance = this.futil.clone(def);
        if (id.ref == null)
            id.ref = this.ctrl.createForm(def.component);
        instance.formref = id.ref;
        instance.windowopts = id.modalopts;
        return (instance);
    }
    closeInstance(id, destroy) {
        let inst = this.getInstance(id);
        if (destroy) {
            inst.formref.destroy();
            inst.windowopts = null;
            inst.formref = null;
        }
    }
}

class FormDefinitions {
    static setForm(def) {
        FormDefinitions.forms.unshift(def);
    }
    static getForms() {
        return (FormDefinitions.forms);
    }
    static getWindowOpts(form) {
        let wopts = FormDefinitions.windowopts.get(form);
        if (wopts == null) {
            wopts = {};
            FormDefinitions.windowopts.set(form, wopts);
        }
        return (wopts);
    }
    static setOnInit(form, func) {
        let funcs = FormDefinitions.oninit.get(form);
        if (funcs == null)
            funcs = [];
        funcs.push(func);
        FormDefinitions.oninit.set(form, funcs);
    }
    static setOnShow(form, func) {
        let funcs = FormDefinitions.onshow.get(form);
        if (funcs == null)
            funcs = [];
        funcs.push(func);
        FormDefinitions.onshow.set(form, funcs);
    }
    static setOnHide(form, func) {
        let funcs = FormDefinitions.onhide.get(form);
        if (funcs == null)
            funcs = [];
        funcs.push(func);
        FormDefinitions.onhide.set(form, funcs);
    }
    static setOnConnect(form, func) {
        let funcs = FormDefinitions.onconn.get(form);
        if (funcs == null)
            funcs = [];
        funcs.push(func);
        FormDefinitions.onconn.set(form, funcs);
    }
    static setOnDisconnect(form, func) {
        let funcs = FormDefinitions.ondisc.get(form);
        if (funcs == null)
            funcs = [];
        funcs.push(func);
        FormDefinitions.ondisc.set(form, funcs);
    }
    static setOnDestroy(form, func) {
        let funcs = FormDefinitions.ondest.get(form);
        if (funcs == null)
            funcs = [];
        funcs.push(func);
        FormDefinitions.ondest.set(form, funcs);
    }
    static getOnInit(form) {
        let funcs = FormDefinitions.oninit.get(form);
        if (funcs == null)
            funcs = [];
        return (funcs);
    }
    static getOnShow(form) {
        let funcs = FormDefinitions.onshow.get(form);
        if (funcs == null)
            funcs = [];
        return (funcs);
    }
    static getOnHide(form) {
        let funcs = FormDefinitions.onhide.get(form);
        if (funcs == null)
            funcs = [];
        return (funcs);
    }
    static getOnConnect(form) {
        let funcs = FormDefinitions.onconn.get(form);
        if (funcs == null)
            funcs = [];
        return (funcs);
    }
    static getOnDisconnect(form) {
        let funcs = FormDefinitions.ondisc.get(form);
        if (funcs == null)
            funcs = [];
        return (funcs);
    }
    static getOnDestroy(form) {
        let funcs = FormDefinitions.ondest.get(form);
        if (funcs == null)
            funcs = [];
        return (funcs);
    }
}
FormDefinitions.forms = [];
FormDefinitions.oninit = new Map();
FormDefinitions.onshow = new Map();
FormDefinitions.onhide = new Map();
FormDefinitions.onconn = new Map();
FormDefinitions.ondisc = new Map();
FormDefinitions.ondest = new Map();
FormDefinitions.windowopts = new Map();

class Container {
    constructor() {
        this.components = [];
    }
    register(component) {
        this.components.push(component);
    }
}

class ContainerControl {
    constructor(builder) {
        this.builder = builder;
    }
    setContainer(container) {
        if (container == null)
            container = new Container();
        this.container = container;
    }
    getContainer() {
        let cont = this.container;
        return (cont);
    }
    dropContainer() {
        this.container = null;
    }
}

class ApplicationImpl {
    constructor(app, client, builder) {
        this.app = app;
        this.client = client;
        this.builder = builder;
        this.config = null;
        this.marea = null;
        this.ready = false;
        this.apptitle = null;
        this.formlist = null;
        this.mfactory = null;
        this.formsctl = null;
        this.state = null;
        this.contctl = null;
        this.instances = null;
        this.loadConfig(client);
        this.state = new ApplicationState(this);
        this.contctl = new ContainerControl(builder);
        this.mfactory = new MenuFactory(this.builder);
        this.formsctl = new FormsControl(this, builder);
        this.instances = new InstanceControl(this.formsctl);
        this.setFormsDefinitions(FormDefinitions.getForms());
        this.state.appmenu = this.createmenu(this.state.menu);
    }
    loadConfig(client) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_1__["__awaiter"])(this, void 0, void 0, function* () {
            let config = new Config(client);
            this.config = yield config.getConfig();
            if (this.config.hasOwnProperty("title"))
                this.setTitle(this.config["title"]);
            if (this.config.hasOwnProperty("theme")) {
                let prefs = new Preferences();
                prefs.setTheme(this.config["theme"]);
            }
        });
    }
    get appstate() {
        return (this.state);
    }
    getApplication() {
        return (this.app);
    }
    setTitle(title) {
        this.apptitle = title;
        this.showTitle(title);
    }
    getCurrentTitle() {
        if (this.state.form != null)
            return (this.state.form.title);
        return (this.apptitle);
    }
    close() {
        this.closeform(this.state.form, true);
    }
    setMenu(menu) {
        this.deletemenu(this.state.menu);
        this.state.menu = menu;
        this.state.appmenu = this.createmenu(menu);
        this.showMenu(this.state.appmenu);
    }
    getMenu() {
        return (this.state.menu);
    }
    showTitle(title) {
        if (title == null)
            title = this.apptitle;
        document.title = title;
    }
    showPath(name, path) {
        let state = { additionalInformation: 'None' };
        let url = window.location.protocol + '//' + window.location.host;
        window.history.replaceState(state, name, url + path);
    }
    getFormsList() {
        return (this.formsctl.getFormsList());
    }
    getFormsDefinitions() {
        return (this.formsctl.getFormsDefinitions());
    }
    setFormList(formlist) {
        this.formlist = formlist;
    }
    setMenuArea(area) {
        this.marea = area;
        this.showMenu(this.state.appmenu);
    }
    setFormArea(area) {
        this.formsctl.setFormArea(area);
        this.ready = true;
    }
    setContainer(container) {
        this.contctl.setContainer(container);
    }
    getContainer() {
        return (this.contctl.getContainer());
    }
    dropContainer() {
        this.contctl.dropContainer();
    }
    newForm(impl, formdef) {
        impl.path = formdef.path;
        impl.title = formdef.title;
        impl.initiated(true);
        this.state.addForm(impl);
        let funcs = FormDefinitions.getOnInit(impl.name);
        for (let i = 0; i < funcs.length; i++)
            this.execfunc(impl, funcs[i]);
    }
    preform(impl, parameters, formdef, path) {
        if (!impl.initiated())
            this.newForm(impl, formdef);
        impl.setParameters(parameters);
        let funcs = FormDefinitions.getOnShow(impl.name);
        for (let i = 0; i < funcs.length; i++)
            this.execfunc(impl, funcs[i]);
        this.showTitle(impl.title);
        if (path)
            this.showPath(impl.name, impl.path);
    }
    postform(impl, destroy) {
        let funcs = FormDefinitions.getOnHide(impl.name);
        for (let i = 0; i < funcs.length; i++)
            this.execfunc(impl, funcs[i]);
        if (destroy) {
            this.state.dropForm(impl);
            let funcs = FormDefinitions.getOnDestroy(impl.name);
            for (let i = 0; i < funcs.length; i++)
                this.execfunc(impl, funcs[i]);
        }
    }
    execfunc(impl, func) {
        try {
            impl.form[func]();
        }
        catch (error) {
            console.log(error);
        }
    }
    showform(form, destroy, parameters) {
        var _a;
        if (!this.ready) {
            setTimeout(() => { this.showform(form, destroy, parameters); }, 10);
            return;
        }
        if (this.state.form != null) {
            // if form has called anoother form
            let curr = this.state.form.getChain();
            if (curr != this.state.form) {
                // let form handle the showform
                curr.showform(form, destroy, parameters);
                return;
            }
            if (this.state.form.getModalWindow() != null)
                return;
            this.closeform(this.state.form, false);
        }
        if (destroy)
            this.formsctl.closeform(form, destroy);
        let formdef = this.getFormInstance(form);
        if (formdef == null)
            return;
        let impl = formdef.formref.instance["impl"];
        this.preform(impl, parameters, formdef, true);
        this.state.form = impl;
        let fmenu = impl.getDropDownMenu();
        if (!((_a = formdef.windowopts) === null || _a === void 0 ? void 0 : _a.wizard))
            this.showMenu(fmenu);
        DropDownMenu.setForm(fmenu, formdef.formref.instance);
        this.formsctl.display(formdef);
        if (this.formlist != null)
            this.formlist.open(formdef.path);
    }
    showinstance(inst) {
        if (this.ready)
            this.formsctl.display(inst);
        else
            setTimeout(() => { this.showinstance(inst); }, 10);
    }
    closeform(impl, destroy) {
        if (impl == null)
            return;
        this.postform(impl, destroy);
        this.formsctl.closeform(impl.name, destroy);
        if (this.state.appmenu != null)
            DropDownMenu.setForm(this.state.appmenu, null);
        this.showPath("", "");
        this.showTitle(null);
        this.state.form = null;
        this.showMenu(this.state.appmenu);
    }
    getFormInstance(form) {
        return (this.formsctl.getFormInstance(form));
    }
    getNewInstance(form, modal) {
        return (this.instances.getNewInstance(form, modal));
    }
    getInstance(id) {
        return (this.instances.getInstance(id));
    }
    closeInstance(id, destroy) {
        this.postform(id.impl, destroy);
        this.instances.closeInstance(id, destroy);
    }
    showMenu(menu) {
        if (this.marea != null)
            this.marea.display(menu);
    }
    deletemenu(menu) {
        this.state.dropMenu(menu);
    }
    createmenu(menu) {
        if (menu == null)
            return (null);
        this.state.addMenu(menu);
        let ddmenu = this.mfactory.create(this, menu);
        return (ddmenu);
    }
    setFormsDefinitions(forms) {
        for (let i = 0; i < forms.length; i++) {
            let fname = forms[i].component.name.toLowerCase();
            forms[i].windowopts = FormDefinitions.getWindowOpts(fname);
            forms[i].databaseusage = DatabaseDefinitions.getFormUsage(fname);
        }
        let formsmap = this.formsctl.setFormsDefinitions(forms);
        this.instances.setFormsDefinitions(formsmap);
        let form = window.location.pathname;
        if (form.length > 1) {
            let name = this.formsctl.findFormByPath(form);
            if (name == null)
                return;
            let inst = this.formsctl.getFormsDefinitions().get(name);
            if (!inst.navigable) {
                this.showPath("", "");
                return;
            }
            let params = new Map();
            let urlparams = new URLSearchParams(window.location.search);
            urlparams.forEach((value, key) => { params.set(key, value); });
            this.showform(name, false, params);
        }
    }
}

class Builder {
    constructor(resolver, injector, app) {
        this.resolver = resolver;
        this.injector = injector;
        this.app = app;
    }
    createComponent(component) {
        let cref = this.resolver.resolveComponentFactory(component).create(this.injector);
        return (cref);
    }
    getAppRef() {
        return (this.app);
    }
}
Builder.ɵfac = function Builder_Factory(t) { return new (t || Builder)(Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"])(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]), Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"])(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]), Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"])(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationRef"])); };
Builder.ɵprov = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"])({ token: Builder, factory: Builder.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(Builder, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root',
            }]
    }], function () { return [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ApplicationRef"] }]; }, null); })();

class Application {
    // dont rename impl as it is read behind the scenes
    constructor(client, builder) {
        this.impl = new ApplicationImpl(this, client, builder);
    }
    get Title() {
        return (this.title$);
    }
    set Title(title) {
        this.title$ = title;
        this.impl.setTitle(title);
    }
    get AppOrFormTitle() {
        return (this.impl.getCurrentTitle());
    }
    set Menu(menu) {
        this.impl.setMenu(menu);
    }
    get Menu() {
        return (this.impl.getMenu());
    }
    newform(form, parameters) {
        this.impl.showform(form, true, parameters);
    }
    showform(form, parameters) {
        this.impl.showform(form, false, parameters);
    }
    get preferences() {
        return (new Preferences());
    }
    closeform(destroy) {
        if (destroy == undefined)
            destroy = false;
        let form = this.impl.appstate.form;
        if (form != null)
            form.close(destroy);
    }
    connect(usr, pwd) {
        this.impl.appstate.connect(usr, pwd);
    }
    disconnect() {
        this.impl.appstate.disconnect();
    }
}
Application.ɵfac = function Application_Factory(t) { return new (t || Application)(Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"])(_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]), Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"])(Builder)); };
Application.ɵprov = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"])({ token: Application, factory: Application.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(Application, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"],
        args: [{
                providedIn: 'root',
            }]
    }], function () { return [{ type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }, { type: Builder }]; }, null); })();

const _c0$3 = ["menu"];
class MenuArea {
    constructor(app, change) {
        this.change = change;
        this.app = app["impl"];
    }
    remove() {
        if (this.element != null) {
            let menuelem = this.menu.firstElementChild;
            if (menuelem != null)
                this.menu.removeChild(menuelem);
            this.app.builder.getAppRef().detachView(this.menuref.hostView);
        }
        this.change.detectChanges();
    }
    display(menu) {
        if (menu == null) {
            this.remove();
            return;
        }
        if (this.menu == null) {
            setTimeout(() => { this.display(menu); }, 10);
            return;
        }
        if (this.element != null) {
            let menuelem = this.menu.firstElementChild;
            if (menuelem != null)
                this.menu.removeChild(menuelem);
            this.app.builder.getAppRef().detachView(this.menuref.hostView);
        }
        this.menuref = menu;
        this.element = menu.hostView.rootNodes[0];
        this.app.builder.getAppRef().attachView(this.menuref.hostView);
        this.menu.appendChild(this.element);
        this.change.detectChanges();
    }
    ngAfterViewInit() {
        var _a;
        this.menu = (_a = this.elem) === null || _a === void 0 ? void 0 : _a.nativeElement;
        this.app.setMenuArea(this);
    }
}
MenuArea.ɵfac = function MenuArea_Factory(t) { return new (t || MenuArea)(Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"])(Application), Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"])(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"])); };
MenuArea.ɵcmp = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"])({ type: MenuArea, selectors: [["menuarea"]], viewQuery: function MenuArea_Query(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c0$3, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
    } if (rf & 2) {
        var _t;
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.elem = _t.first);
    } }, decls: 2, vars: 0, consts: [["menu", ""]], template: function MenuArea_Template(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(0, "div", null, 0);
    } }, encapsulation: 2, changeDetection: 0 });
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(MenuArea, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'menuarea',
                template: `
		<div #menu></div>
	`,
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
            }]
    }], function () { return [{ type: Application }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"] }]; }, { elem: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["menu", { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }] }); })();

class Input {
    constructor() {
        this.html = "<input></input>";
    }
}

class Password {
    constructor() {
        this.html = "<input type='password'></input>";
    }
}

class FieldTypes {
    static init() {
        if (FieldTypes.types != null)
            return;
        FieldTypes.types = new Map();
        FieldTypes.types.set("input", Input);
        FieldTypes.types.set("password", Password);
    }
    static getClass(type) {
        FieldTypes.init();
        return (FieldTypes.types.get(type.toLowerCase()));
    }
}
FieldTypes.types = null;

const _c0$4 = ["field"];
class Field {
    constructor(app) {
        this.name = "";
        this.block = "";
        this.style = "";
        this.app = app["impl"];
    }
    get type() {
        return (this.type$);
    }
    set type(type) {
        this.type$ = type;
        this.field.innerHTML = null;
        let cname = FieldTypes.getClass(type);
        if (cname != null) {
            this.clazz = new cname();
            this.field.innerHTML = this.clazz.html;
            this.addTriggers();
        }
    }
    onEvent(event) {
        console.log(this.name + " type: " + event.type);
        if (event.type == "keyup") {
            console.log("key " + event.keyCode);
            console.log("alt: " + event.altKey);
            console.log("ctrl: " + event.ctrlKey);
            console.log("meta: " + event.metaKey);
            console.log("shift: " + event.shiftKey);
        }
    }
    ngAfterViewInit() {
        var _a;
        this.field = (_a = this.fieldelem) === null || _a === void 0 ? void 0 : _a.nativeElement;
        this.app.getContainer().register(this);
    }
    addTriggers() {
        let impl = this.field.firstChild;
        if (impl == null)
            return;
        impl.addEventListener("blur", (event) => { this.onEvent(event); });
        impl.addEventListener("focus", (event) => { this.onEvent(event); });
        impl.addEventListener("keyup", (event) => { this.onEvent(event); });
        impl.addEventListener("change", (event) => { this.onEvent(event); });
        impl.addEventListener("onclick", (event) => { this.onEvent(event); });
        impl.addEventListener("ondblclick", (event) => { this.onEvent(event); });
    }
}
Field.ɵfac = function Field_Factory(t) { return new (t || Field)(Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"])(Application)); };
Field.ɵcmp = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"])({ type: Field, selectors: [["field"]], viewQuery: function Field_Query(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c0$4, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
    } if (rf & 2) {
        var _t;
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.fieldelem = _t.first);
    } }, inputs: { name: "name", block: "block", style: "style" }, decls: 2, vars: 0, consts: [["field", ""]], template: function Field_Template(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(0, "span", null, 0);
    } }, encapsulation: 2 });
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(Field, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'field',
                template: '<span #field></span>'
            }]
    }], function () { return [{ type: Application }]; }, { name: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"],
            args: ["name"]
        }], block: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"],
            args: ["block"]
        }], style: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"],
            args: ["style"]
        }], fieldelem: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["field", { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }] }); })();

class BlockImpl {
    constructor(block) {
        this.block = block;
        this.dbusage = { query: true, insert: true, update: true, delete: true };
    }
    set name(alias) {
        this.name$ = alias;
    }
    get name() {
        return (this.name$);
    }
    setDatabaseUsage(usage) {
        this.dbusage = usage;
    }
}

class Block {
    // dont rename impl as it is read behind the scenes
    constructor() {
        this.impl = new BlockImpl(this);
    }
    get name() {
        return (this.impl.name);
    }
    setDatabaseUsage(usage) {
        this.impl.setDatabaseUsage(usage);
    }
}

var Transaction;
(function (Transaction) {
    Transaction[Transaction["start"] = 0] = "start";
    Transaction[Transaction["commit"] = 1] = "commit";
    Transaction[Transaction["rollback"] = 2] = "rollback";
})(Transaction || (Transaction = {}));

const FORM = (component, title, path, navigable) => {
    function def(_target) {
        let def = {
            path: path,
            title: title,
            component: component,
        };
        if (navigable != undefined)
            def["navigable"] = navigable;
        FormDefinitions.setForm(def);
    }
    return (def);
};

const INIT = (form, func) => {
    let utils = new Utils();
    let fname = utils.getName(form);
    FormDefinitions.setOnInit(fname, func);
};

const SHOW = (form, func) => {
    let utils = new Utils();
    let fname = utils.getName(form);
    FormDefinitions.setOnShow(fname, func);
};

const HIDE = (form, func) => {
    let utils = new Utils();
    let fname = utils.getName(form);
    FormDefinitions.setOnHide(fname, func);
};

const BLOCK = (alias, component, usage) => {
    function def(comp, prop) {
        let utils = new Utils();
        let name = utils.getName(comp);
        let type = utils.getType(comp);
        if (alias != null)
            alias = alias.toLowerCase();
        if (type == "Block") {
            BlockDefinitions.setBlockDefaultAlias(name, alias);
            return;
        }
        let def = {
            prop: prop,
            alias: alias,
            component: component,
            databaseopts: usage
        };
        BlockDefinitions.setBlock(name, def);
    }
    return (def);
};

const WIZARD = () => {
    function def(form) {
        let utils = new Utils();
        let fname = utils.getName(form);
        let wopt = FormDefinitions.getWindowOpts(fname);
        wopt.wizard = true;
    }
    return (def);
};

const WINDOW = (inherit, top, left, width, height) => {
    function def(form) {
        let utils = new Utils();
        let fname = utils.getName(form);
        if (top != null && top.constructor.name == "Number")
            top += "px";
        if (left != null && left.constructor.name == "Number")
            left += "px";
        if (width != null && width.constructor.name == "Number")
            width += "px";
        if (height != null && height.constructor.name == "Number")
            height += "px";
        let wopt = FormDefinitions.getWindowOpts(fname);
        wopt.inherit = inherit;
        wopt.offsetTop = "" + top;
        wopt.width = "" + width;
        wopt.height = "" + height;
        wopt.offsetLeft = "" + left;
    }
    return (def);
};

const CONNECT = (form, func) => {
    let utils = new Utils();
    let fname = utils.getName(form);
    FormDefinitions.setOnConnect(fname, func);
};

const DESTROY = (form, func) => {
    let utils = new Utils();
    let fname = utils.getName(form);
    FormDefinitions.setOnDestroy(fname, func);
};

const DATABASE = (usage) => {
    function def(component, prop) {
        let utils = new Utils();
        let comp = utils.getName(component);
        let type = utils.getType(component);
        if (type == "Form" && prop == null) {
            DatabaseDefinitions.setFormUsage(comp, usage);
            return;
        }
        if (type == "Block" && prop == null) {
            DatabaseDefinitions.setBlockDefault(comp, usage);
            return;
        }
        DatabaseDefinitions.setBlockUsage(comp, prop, usage);
    }
    return (def);
};

const DISCONNECT = (form, func) => {
    let utils = new Utils();
    let fname = utils.getName(form);
    FormDefinitions.setOnDisconnect(fname, func);
};

const _c0$5 = ["html"];
class FormList {
    constructor(app) {
        this.page = "";
        this.ready = false;
        this.name = "/";
        this.app = app["impl"];
        this.root = new Folder(this.name);
        Preferences.notify(this, "setColors");
        this.app.setFormList(this);
        this.formsdef = this.app.getFormsList();
        this.parse();
        this.page += "<html>\n";
        this.page += "  <head>\n";
        this.page += "    <style>\n";
        this.page += this.styles() + "\n";
        this.page += "    </style>\n";
        this.page += "  </head>\n";
        this.page += "  <body>\n";
        this.page += "    <div class='formlist'>\n";
        this.page += this.print("/", this.root, 0, [true]);
        this.page += "    </div>\n";
        this.page += "  </body>\n";
        this.page += "</html>\n";
    }
    open(folder) {
        if (!this.ready) {
            setTimeout(() => { this.open(folder); }, 10);
            return;
        }
        folder = folder.trim();
        let parts = folder.split("/");
        let current = this.root;
        for (let i = 0; i < parts.length; i++) {
            current = current.findFolder([parts[i]]);
            if (current == null)
                return;
            if (!current.content.classList.contains("formlist-active")) {
                current.img.src = "/assets/images/open.jpg";
                current.content.classList.toggle("formlist-active");
            }
        }
    }
    print(path, root, level, last) {
        let html = "";
        html += this.folder(path, root, level, last);
        html += "<div class='formlist-folder-content' id='" + path + "-content'>";
        level++;
        last.push(false);
        if (path == "/")
            path = "";
        let subs = root.folders.length;
        let forms = root.forms.length;
        for (let i = 0; i < subs; i++) {
            let folder = root.folders[i];
            if (i == subs - 1 && forms == 0)
                last[level] = true;
            html += this.print(path + "/" + folder.name, folder, level, last);
        }
        last[level] = false;
        html += this.forms(root, level, last);
        last.pop();
        html += "</div>";
        return (html);
    }
    parse() {
        for (let i = 0; i < this.formsdef.length; i++) {
            let path = this.formsdef[i].path;
            if (!this.formsdef[i].navigable)
                continue;
            let form = path;
            let folder = "/";
            let pos = path.lastIndexOf("/");
            if (pos >= 0) {
                form = path.substring(pos + 1);
                folder = path.substring(0, pos);
            }
            let current = this.root;
            let parts = folder.split("/");
            for (let p = 1; p < parts.length; p++) {
                if (parts[p] == "")
                    parts[p] = "/";
                current = current.getFolder(parts[p].trim());
            }
            current.addForm(form, this.formsdef[i]);
        }
    }
    ngAfterViewInit() {
        var _a;
        this.html = (_a = this.elem) === null || _a === void 0 ? void 0 : _a.nativeElement;
        this.html.innerHTML = this.page;
        let folders = this.html.getElementsByClassName("formlist-folder");
        for (let i = 0; i < folders.length; i++) {
            let container = folders.item(i);
            let content = document.getElementById(container.id + "-content");
            let lnk = container.querySelector("[id='" + container.id + "-lnk']");
            let img = container.querySelector("[id='" + container.id + "-img']");
            let folder = this.root.findFolder(container.id.split("/"));
            folder.img = img;
            folder.lnk = lnk;
            folder.content = content;
            folder.img.addEventListener("click", (event) => this.toggle(event));
            folder.lnk.addEventListener("click", (event) => this.toggle(event));
        }
        let forms = this.html.getElementsByClassName("formlist-form");
        for (let i = 0; i < forms.length; i++) {
            let form = forms.item(i);
            let lnk = form.querySelector("[id='" + form.id + "-lnk']");
            lnk.addEventListener("click", (event) => this.show(event));
        }
        this.setColors();
        this.open("/");
        this.root.lnk.innerHTML = this.name;
        this.ready = true;
    }
    setColors() {
        let prefs = new Preferences();
        let link = prefs.colors.link;
        let tree = prefs.colors.foldertree;
        let list = null;
        list = this.html.getElementsByClassName("formlist-txt");
        for (let i = 0; i < list.length; i++)
            list[i].style.color = tree;
        list = this.html.getElementsByClassName("formlist-link");
        for (let i = 0; i < list.length; i++)
            list[i].style.color = link;
        list = this.html.getElementsByClassName("formlist-off");
        for (let i = 0; i < list.length; i++)
            list[i].style.borderLeft = "1px solid " + tree;
        list = this.html.getElementsByClassName("formlist-vln");
        for (let i = 0; i < list.length; i++)
            list[i].style.borderLeft = "1px solid " + tree;
        list = this.html.getElementsByClassName("formlist-cnr");
        for (let i = 0; i < list.length; i++) {
            list[i].style.borderLeft = "1px solid " + tree;
            list[i].style.borderBottom = "1px solid " + tree;
        }
    }
    toggle(event) {
        let fname = event.target.id;
        fname = fname.substring(0, fname.length - 4);
        let folder = this.root.findFolder(fname.split("/"));
        folder.content.classList.toggle("formlist-active");
        if (folder.content.classList.contains("formlist-active")) {
            folder.img.src = "/assets/images/open.jpg";
        }
        else {
            folder.img.src = "/assets/images/closed.jpg";
        }
    }
    show(event) {
        let fname = event.target.id;
        fname = fname.substring(0, fname.length - 4);
        this.app.showform(fname, false);
    }
    folder(path, root, level, last) {
        let html = "";
        html += "<div id='" + path + "' class='formlist-folder'>\n";
        if (level > 0) {
            html += this.half();
            for (let i = 1; i < level; i++)
                html += this.indent(last[i]);
        }
        if (level > 0)
            html += this.pre(last[level]);
        html += "<img class='formlist-img' id='" + path + "-img' src='/assets/images/closed.jpg'>\n";
        html += "<span class='formlist-txt' id='" + path + "-lnk'>" + root.name + "</span>\n";
        html += "</div>\n";
        return (html);
    }
    forms(root, level, last) {
        let html = "";
        for (let i = 0; i < root.forms.length; i++) {
            if (i == root.forms.length - 1)
                last[level] = true;
            html += this.form(root.forms[i], level, last);
        }
        return (html);
    }
    form(form, level, last) {
        let html = "";
        html += "<div id='" + form.def.name + "' class='formlist-form'>\n";
        html += this.half();
        for (let i = 1; i < level; i++)
            html += this.indent(last[i]);
        if (level > 0)
            html += this.pre(last[last.length - 1]);
        html += "<span class='formlist-link' id='" + form.def.name + "-lnk'> " + form.name + "</span>\n";
        html += "</div>\n";
        return (html);
    }
    pre(last) {
        let html = "";
        html += "<span class='formlist-lct'>\n";
        html += " <span class='formlist-off'></span>\n";
        html += " <span class='formlist-cnr'></span>\n";
        if (last)
            html += "<span class='formlist-end'></span>\n";
        else
            html += "<span class='formlist-vln'></span>\n";
        html += "</span>\n";
        return (html);
    }
    indent(skip) {
        let html = "";
        if (skip) {
            html += "<span class='formlist-lct'>\n";
            html += "</span>\n";
            html += " <span class='formlist-ind'></span>\n";
        }
        else {
            html += "<span class='formlist-lct'>\n";
            html += " <span class='formlist-vln'></span>\n";
            html += " <span class='formlist-vln'></span>\n";
            html += " <span class='formlist-vln'></span>\n";
            html += "</span>\n";
            html += " <span class='formlist-ind'></span>\n";
        }
        return (html);
    }
    half() {
        let html = "";
        html += " <span class='formlist-ind'></span>\n";
        return (html);
    }
    styles() {
        let styles = `
		.formlist
		{
			position: fixed;
		}

    	.formlist-folder
    	{
			margin: 0;
			padding: 0;
			width: 100%;
			height: 100%;
			font-size: 0;
			position: relative;
			border-collapse: collapse;
    	}

		.formlist-folder-content
		{
			display: none;
		}

		.formlist-lct
		{
			width: 16px;
			height: 24px;
			pointer-events:none;
			white-space: nowrap;
			display: inline-block;
			vertical-align: middle;
		}

		.formlist-txt
		{
			width: 16px;
			height: 21px;
			font-size: 16px;
			cursor: pointer;
			white-space: nowrap;
			display: inline-block;
			vertical-align: bottom;
		}

		.formlist-off
		{
			width: 16px;
			height: 4px;
			display: block;
			pointer-events:none;
		}

		.formlist-vln
		{
			width: 16px;
			height: 12px;
			display: block;
			pointer-events:none;
		}

		.formlist-cnr
		{
			width: 16px;
			height: 8px;
			display: block;
			pointer-events:none;
		}

		.formlist-end
		{
			width: 16px;
			height: 12px;
			display: block;
			pointer-events:none;
		}

		.formlist-ind
		{
			width: 12px;
			height: 24px;
			white-space: nowrap;
			pointer-events:none;
			display: inline-block;
			vertical-align: middle;
		}

		.formlist-img
		{
			width: 24px;
			height: 24px;
			cursor: pointer;
			vertical-align: middle;
		}

		.formlist-link
		{
			width: 16px;
			height: 22px;
			cursor: pointer;
			font-size: 16px;
			margin-left: 8px;
			font-style: italic;
			white-space: nowrap;
			display: inline-block;
			vertical-align: bottom;
		}

		.formlist-form
		{
			margin: 0;
			padding: 0;
			font-size: 0;
			display: block;
			border-collapse: collapse;
		}

		.formlist-active
		{
			display: block;
		}
		`;
        return (styles);
    }
}
FormList.ɵfac = function FormList_Factory(t) { return new (t || FormList)(Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"])(Application)); };
FormList.ɵcmp = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"])({ type: FormList, selectors: [["formlist"]], viewQuery: function FormList_Query(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c0$5, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
    } if (rf & 2) {
        var _t;
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.elem = _t.first);
    } }, inputs: { name: ["root", "name"] }, decls: 2, vars: 0, consts: [[2, "display", "inline-block", "white-space", "nowrap"], ["html", ""]], template: function FormList_Template(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(0, "div", 0, 1);
    } }, encapsulation: 2 });
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(FormList, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'formlist',
                template: `
		<div #html style="display: inline-block; white-space: nowrap;"></div>
	`,
                styles: []
            }]
    }], function () { return [{ type: Application }]; }, { name: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"],
            args: ['root']
        }], elem: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["html", { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }] }); })();
class Folder {
    constructor(name) {
        this.forms = [];
        this.folders = [];
        this.name = name;
    }
    getFolder(next) {
        if (next == this.name)
            return (this);
        for (let i = 0; i < this.folders.length; i++)
            if (this.folders[i].name == next)
                return (this.folders[i]);
        let folder = new Folder(next);
        this.folders.push(folder);
        return (folder);
    }
    findFolder(path) {
        while (path[0] == "")
            path.shift();
        if (path.length == 0)
            return (this);
        let next = null;
        for (let i = 0; i < this.folders.length; i++) {
            if (this.folders[i].name == path[0]) {
                next = this.folders[i];
                break;
            }
        }
        if (next == null)
            return (null);
        path.shift();
        return (next.findFolder(path));
    }
    addForm(name, form) {
        this.forms.push({ name: name, def: form });
    }
    print() {
        console.log("");
        console.log("Folder: " + this.name);
        for (let i = 0; i < this.forms.length; i++)
            console.log("Form: " + this.forms[i].name);
        for (let i = 0; i < this.folders.length; i++)
            this.folders[i].print();
    }
}

const _c0$6 = ["formarea"];
class FormArea {
    constructor(app) {
        this.app = app;
    }
    getFormsArea() {
        return (this.formarea.nativeElement);
    }
    ngAfterViewInit() {
        let impl = this.app["impl"];
        impl.setFormArea(this);
    }
}
FormArea.ɵfac = function FormArea_Factory(t) { return new (t || FormArea)(Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"])(Application)); };
FormArea.ɵcmp = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"])({ type: FormArea, selectors: [["formarea"]], viewQuery: function FormArea_Query(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"])(_c0$6, true, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]);
    } if (rf & 2) {
        var _t;
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"])(_t = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"])()) && (ctx.formarea = _t.first);
    } }, decls: 2, vars: 0, consts: [["formarea", ""]], template: function FormArea_Template(rf, ctx) { if (rf & 1) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"])(0, "div", null, 0);
    } }, encapsulation: 2 });
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(FormArea, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'formarea',
                template: '<div #formarea></div>',
                styleUrls: []
            }]
    }], function () { return [{ type: Application }]; }, { formarea: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ["formarea", { read: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"] }]
        }] }); })();

class FormsLibrary {
}
FormsLibrary.ɵmod = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"])({ type: FormsLibrary });
FormsLibrary.ɵinj = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"])({ factory: function FormsLibrary_Factory(t) { return new (t || FormsLibrary)(); }, imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"]]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"])(FormsLibrary, { declarations: [FormList, FormArea, ModalWindow, MenuArea, LoginForm, Field], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"]], exports: [FormList, FormArea, MenuArea, Field] }); })();
/*@__PURE__*/ (function () { Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"])(FormsLibrary, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                declarations: [FormList, FormArea, ModalWindow, MenuArea, LoginForm, Field],
                exports: [FormList, FormArea, MenuArea, Field],
                imports: [_angular_common__WEBPACK_IMPORTED_MODULE_3__["CommonModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"]]
            }]
    }], null, null); })();
Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetComponentScope"])(LoginForm, [_angular_common__WEBPACK_IMPORTED_MODULE_3__["NgClass"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgComponentOutlet"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgForOf"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgTemplateOutlet"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgStyle"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgSwitch"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgSwitchCase"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgSwitchDefault"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgPlural"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgPluralCase"], FormList, FormArea, ModalWindow, MenuArea, LoginForm, Field], [_angular_common__WEBPACK_IMPORTED_MODULE_3__["AsyncPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["UpperCasePipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["LowerCasePipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["JsonPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["SlicePipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["DecimalPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["PercentPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["TitleCasePipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["CurrencyPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["DatePipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["I18nPluralPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["I18nSelectPipe"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["KeyValuePipe"]]);

/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=forms.js.map


/***/ }),

/***/ "../../node_modules/webpack/hot sync ^\\.\\/log$":
/*!*************************************************!*\
  !*** (webpack)/hot sync nonrecursive ^\.\/log$ ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./log": "../../node_modules/webpack/hot/log.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "../../node_modules/webpack/hot sync ^\\.\\/log$";

/***/ }),

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/ApplicationModule.ts":
/*!**************************************!*\
  !*** ./src/app/ApplicationModule.ts ***!
  \**************************************/
/*! exports provided: ApplicationModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApplicationModule", function() { return ApplicationModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _ApplicationRoot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ApplicationRoot */ "./src/app/ApplicationRoot.ts");
/* harmony import */ var _MaterialModules__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MaterialModules */ "./src/app/MaterialModules.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser */ "../../node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");
/* harmony import */ var forms42__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! forms42 */ "../../../FormsLibrary/dist/forms/fesm2015/forms.js");
/* harmony import */ var _forms_Test1__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./forms/Test1 */ "./src/app/forms/Test1.ts");
/* harmony import */ var _forms_Test2__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./forms/Test2 */ "./src/app/forms/Test2.ts");
/* harmony import */ var _forms_Test3__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./forms/Test3 */ "./src/app/forms/Test3.ts");






// Formsdefinitions





let ApplicationModule = class ApplicationModule {
    constructor(app) {
        app.Title = "Demo";
        //app.preferences.setTheme("yellow");
    }
    func() { }
};
ApplicationModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({ type: ApplicationModule, bootstrap: [_ApplicationRoot__WEBPACK_IMPORTED_MODULE_2__["ApplicationRoot"]] });
ApplicationModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({ factory: function ApplicationModule_Factory(t) { return new (t || ApplicationModule)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](forms42__WEBPACK_IMPORTED_MODULE_5__["Application"])); }, providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["BrowserModule"],
            _MaterialModules__WEBPACK_IMPORTED_MODULE_3__["MaterialModules"],
            forms42__WEBPACK_IMPORTED_MODULE_5__["FormsLibrary"]
        ]] });
ApplicationModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(forms42__WEBPACK_IMPORTED_MODULE_5__["FORM"])(_forms_Test1__WEBPACK_IMPORTED_MODULE_6__["Test1"], "Demo Form Test1", "/forms/test1"),
    Object(forms42__WEBPACK_IMPORTED_MODULE_5__["FORM"])(_forms_Test2__WEBPACK_IMPORTED_MODULE_7__["Test2"], "Demo Form Test2", "/forms/test2"),
    Object(forms42__WEBPACK_IMPORTED_MODULE_5__["FORM"])(_forms_Test3__WEBPACK_IMPORTED_MODULE_8__["Test3"], "Demo Form Test3", "/modal/test3")
], ApplicationModule);

(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](ApplicationModule, { declarations: [_ApplicationRoot__WEBPACK_IMPORTED_MODULE_2__["ApplicationRoot"],
        _forms_Test1__WEBPACK_IMPORTED_MODULE_6__["Test1"], _forms_Test2__WEBPACK_IMPORTED_MODULE_7__["Test2"], _forms_Test3__WEBPACK_IMPORTED_MODULE_8__["Test3"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["BrowserModule"],
        _MaterialModules__WEBPACK_IMPORTED_MODULE_3__["MaterialModules"],
        forms42__WEBPACK_IMPORTED_MODULE_5__["FormsLibrary"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](ApplicationModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"],
        args: [{
                declarations: [
                    _ApplicationRoot__WEBPACK_IMPORTED_MODULE_2__["ApplicationRoot"],
                    _forms_Test1__WEBPACK_IMPORTED_MODULE_6__["Test1"], _forms_Test2__WEBPACK_IMPORTED_MODULE_7__["Test2"], _forms_Test3__WEBPACK_IMPORTED_MODULE_8__["Test3"]
                ],
                imports: [
                    _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["BrowserModule"],
                    _MaterialModules__WEBPACK_IMPORTED_MODULE_3__["MaterialModules"],
                    forms42__WEBPACK_IMPORTED_MODULE_5__["FormsLibrary"]
                ],
                providers: [],
                bootstrap: [_ApplicationRoot__WEBPACK_IMPORTED_MODULE_2__["ApplicationRoot"]]
            }]
    }], function () { return [{ type: forms42__WEBPACK_IMPORTED_MODULE_5__["Application"] }]; }, null); })();


/***/ }),

/***/ "./src/app/ApplicationRoot.ts":
/*!************************************!*\
  !*** ./src/app/ApplicationRoot.ts ***!
  \************************************/
/*! exports provided: ApplicationRoot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApplicationRoot", function() { return ApplicationRoot; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var forms42__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! forms42 */ "../../../FormsLibrary/dist/forms/fesm2015/forms.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/icon */ "../../node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");





const _c0 = function (a0) { return { "color": a0 }; };
const _c1 = function (a0) { return { "background-color": a0 }; };
class ApplicationRoot {
    constructor(app) {
        this.app = app;
        this.sidenav = true;
    }
    get barcolor() {
        return (this.app.preferences.colors.topbar);
    }
    get btncolor() {
        return (this.app.preferences.colors.buttontext);
    }
    close() {
        this.app.closeform(true);
    }
}
ApplicationRoot.ɵfac = function ApplicationRoot_Factory(t) { return new (t || ApplicationRoot)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](forms42__WEBPACK_IMPORTED_MODULE_1__["Application"])); };
ApplicationRoot.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: ApplicationRoot, selectors: [["forms-app"]], decls: 19, vars: 11, consts: [[1, "toggle"], [1, "toggle-button", 3, "ngStyle", "click"], [1, "close"], [1, "close-button", 3, "ngStyle", "click"], [1, "frame"], [1, "topbar", 3, "ngStyle"], [1, "menu"], ["valign", "top", 2, "width", "1px"], [1, "formlist"], ["root", "demo"], ["valign", "top"], [1, "formarea"]], template: function ApplicationRoot_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "mat-icon", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ApplicationRoot_Template_mat_icon_click_1_listener() { return ctx.sidenav = !ctx.sidenav; });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "menu");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ApplicationRoot_Template_button_click_4_listener() { return ctx.close(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "X");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "table", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "tr", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "td");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](11, "menuarea");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "tr");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "td", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](15, "formlist", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "td", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "formarea");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](5, _c0, ctx.btncolor));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](7, _c0, ctx.btncolor));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](9, _c1, ctx.barcolor));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleProp"]("display", ctx.sidenav ? "block" : "none");
    } }, directives: [_angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIcon"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgStyle"], forms42__WEBPACK_IMPORTED_MODULE_1__["MenuArea"], forms42__WEBPACK_IMPORTED_MODULE_1__["FormList"], forms42__WEBPACK_IMPORTED_MODULE_1__["FormArea"]], styles: [".toggle[_ngcontent-%COMP%]\n{\n    top: 0;\n    bottom: 0;\n    z-index: 1;\n    height: 1.75em;\n    position: absolute;\n}\n\n.toggle-button[_ngcontent-%COMP%]\n{\n    top: 50%;\n    cursor: pointer;\n    position: absolute;\n    transform: translateY(-50%);\n}\n\n.close[_ngcontent-%COMP%]\n{\n    top: 0;\n    right: 0;\n    z-index: 1;\n    width: 1.75em;\n    height: 1.75em;\n    position: absolute;\n    border-left: 1px solid black;\n}\n\n.close-button[_ngcontent-%COMP%]\n{\n    top: 50%;\n    border:none;\n    width: 100%;\n    height: 100%;\n    outline:none;\n    font-size: 0.75em;\n    font-weight: bold;\n    position: relative;\n    background: transparent;\n    transform: translateY(-50%);\n}\n\n.frame[_ngcontent-%COMP%]\n{\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    border: 2px solid black;\n    border-collapse: collapse;\n}\n\n.topbar[_ngcontent-%COMP%]\n{\n    height: 1.75em;\n    border: 2px solid black;\n}\n\n.menu[_ngcontent-%COMP%]\n{\n    display: flex;\n    color: black;\n    justify-content: center;\n}\n\n.formlist[_ngcontent-%COMP%]\n{\n    padding-top: 16px;\n    padding-right: 25px\n}\n\n.formarea[_ngcontent-%COMP%]\n{\n    display: flex;\n    margin-top: 25px;\n    justify-content: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2plY3RzL2RlbW8vc3JjL2FwcC9BcHBsaWNhdGlvblJvb3QuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztJQUVJLE1BQU07SUFDTixTQUFTO0lBQ1QsVUFBVTtJQUNWLGNBQWM7SUFDZCxrQkFBa0I7QUFDdEI7O0FBRUE7O0lBRUksUUFBUTtJQUNSLGVBQWU7SUFDZixrQkFBa0I7SUFDbEIsMkJBQTJCO0FBQy9COztBQUVBOztJQUVJLE1BQU07SUFDTixRQUFRO0lBQ1IsVUFBVTtJQUNWLGFBQWE7SUFDYixjQUFjO0lBQ2Qsa0JBQWtCO0lBQ2xCLDRCQUE0QjtBQUNoQzs7QUFFQTs7SUFFSSxRQUFRO0lBQ1IsV0FBVztJQUNYLFdBQVc7SUFDWCxZQUFZO0lBQ1osWUFBWTtJQUNaLGlCQUFpQjtJQUNqQixpQkFBaUI7SUFDakIsa0JBQWtCO0lBQ2xCLHVCQUF1QjtJQUN2QiwyQkFBMkI7QUFDL0I7O0FBRUE7O0lBRUksTUFBTTtJQUNOLE9BQU87SUFDUCxXQUFXO0lBQ1gsWUFBWTtJQUNaLGtCQUFrQjtJQUNsQix1QkFBdUI7SUFDdkIseUJBQXlCO0FBQzdCOztBQUVBOztJQUVJLGNBQWM7SUFDZCx1QkFBdUI7QUFDM0I7O0FBRUE7O0lBRUksYUFBYTtJQUNiLFlBQVk7SUFDWix1QkFBdUI7QUFDM0I7O0FBRUE7O0lBRUksaUJBQWlCO0lBQ2pCO0FBQ0o7O0FBRUE7O0lBRUksYUFBYTtJQUNiLGdCQUFnQjtJQUNoQix1QkFBdUI7QUFDM0IiLCJmaWxlIjoicHJvamVjdHMvZGVtby9zcmMvYXBwL0FwcGxpY2F0aW9uUm9vdC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIudG9nZ2xlXG57XG4gICAgdG9wOiAwO1xuICAgIGJvdHRvbTogMDtcbiAgICB6LWluZGV4OiAxO1xuICAgIGhlaWdodDogMS43NWVtO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbn1cblxuLnRvZ2dsZS1idXR0b25cbntcbiAgICB0b3A6IDUwJTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcbn1cblxuLmNsb3NlXG57XG4gICAgdG9wOiAwO1xuICAgIHJpZ2h0OiAwO1xuICAgIHotaW5kZXg6IDE7XG4gICAgd2lkdGg6IDEuNzVlbTtcbiAgICBoZWlnaHQ6IDEuNzVlbTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCBibGFjaztcbn1cblxuLmNsb3NlLWJ1dHRvblxue1xuICAgIHRvcDogNTAlO1xuICAgIGJvcmRlcjpub25lO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBvdXRsaW5lOm5vbmU7XG4gICAgZm9udC1zaXplOiAwLjc1ZW07XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcbn1cblxuLmZyYW1lXG57XG4gICAgdG9wOiAwO1xuICAgIGxlZnQ6IDA7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBib3JkZXI6IDJweCBzb2xpZCBibGFjaztcbiAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xufVxuXG4udG9wYmFyXG57XG4gICAgaGVpZ2h0OiAxLjc1ZW07XG4gICAgYm9yZGVyOiAycHggc29saWQgYmxhY2s7XG59XG5cbi5tZW51XG57XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBjb2xvcjogYmxhY2s7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5mb3JtbGlzdFxue1xuICAgIHBhZGRpbmctdG9wOiAxNnB4O1xuICAgIHBhZGRpbmctcmlnaHQ6IDI1cHhcbn1cblxuLmZvcm1hcmVhXG57XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBtYXJnaW4tdG9wOiAyNXB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufSJdfQ== */"] });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ApplicationRoot, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'forms-app',
                templateUrl: './ApplicationRoot.html',
                styleUrls: ['./ApplicationRoot.css']
            }]
    }], function () { return [{ type: forms42__WEBPACK_IMPORTED_MODULE_1__["Application"] }]; }, null); })();


/***/ }),

/***/ "./src/app/MaterialModules.ts":
/*!************************************!*\
  !*** ./src/app/MaterialModules.ts ***!
  \************************************/
/*! exports provided: MaterialModules */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialModules", function() { return MaterialModules; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/button */ "../../node_modules/@angular/material/__ivy_ngcc__/fesm2015/button.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/icon */ "../../node_modules/@angular/material/__ivy_ngcc__/fesm2015/icon.js");

//import {A11yModule} from '@angular/cdk/a11y';
//import {ClipboardModule} from '@angular/cdk/clipboard';
//import {DragDropModule} from '@angular/cdk/drag-drop';
//import {PortalModule} from '@angular/cdk/portal';
//import {ScrollingModule} from '@angular/cdk/scrolling';
//import {CdkStepperModule} from '@angular/cdk/stepper';
//import {CdkTableModule} from '@angular/cdk/table';
//import {CdkTreeModule} from '@angular/cdk/tree';
//import {MatAutocompleteModule} from '@angular/material/autocomplete';
//import {MatBadgeModule} from '@angular/material/badge';
//import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

//import {MatButtonToggleModule} from '@angular/material/button-toggle';
//import {MatCardModule} from '@angular/material/card';
//import {MatCheckboxModule} from '@angular/material/checkbox';
//import {MatChipsModule} from '@angular/material/chips';
//import {MatStepperModule} from '@angular/material/stepper';
//import {MatDatepickerModule} from '@angular/material/datepicker';
//import {MatDialogModule} from '@angular/material/dialog';
//import {MatDividerModule} from '@angular/material/divider';
//import {MatExpansionModule} from '@angular/material/expansion';
//import {MatGridListModule} from '@angular/material/grid-list';


//import {MatInputModule} from '@angular/material/input';
//import {MatListModule} from '@angular/material/list';
//import {MatMenuModule} from '@angular/material/menu';
//import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
//import {MatPaginatorModule} from '@angular/material/paginator';
//import {MatProgressBarModule} from '@angular/material/progress-bar';
//import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
//import {MatRadioModule} from '@angular/material/radio';
//import {MatSelectModule} from '@angular/material/select';
//import {MatSidenavModule} from '@angular/material/sidenav';
//import {MatSliderModule} from '@angular/material/slider';
//import {MatSlideToggleModule} from '@angular/material/slide-toggle';
//import {MatSnackBarModule} from '@angular/material/snack-bar';
//import {MatSortModule} from '@angular/material/sort';
//import {MatTableModule} from '@angular/material/table';
//import {MatTabsModule} from '@angular/material/tabs';
//import {MatToolbarModule} from '@angular/material/toolbar';
//import {MatTooltipModule} from '@angular/material/tooltip';
//import {MatTreeModule} from '@angular/material/tree';
//import {OverlayModule} from '@angular/cdk/overlay';
//import {MatFormFieldModule} from '@angular/material/form-field';
//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
/* export list
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    BrowserAnimationsModule
*/
class MaterialModules {
}
MaterialModules.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: MaterialModules });
MaterialModules.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function MaterialModules_Factory(t) { return new (t || MaterialModules)(); }, imports: [_angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIconModule"],
        _angular_material_button__WEBPACK_IMPORTED_MODULE_1__["MatButtonModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](MaterialModules, { exports: [_angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIconModule"],
        _angular_material_button__WEBPACK_IMPORTED_MODULE_1__["MatButtonModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](MaterialModules, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                exports: [
                    _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIconModule"],
                    _angular_material_button__WEBPACK_IMPORTED_MODULE_1__["MatButtonModule"]
                ]
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/forms/Test1.ts":
/*!********************************!*\
  !*** ./src/app/forms/Test1.ts ***!
  \********************************/
/*! exports provided: Test1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Test1", function() { return Test1; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _menus_CustomMenu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../menus/CustomMenu */ "./src/app/menus/CustomMenu.ts");
/* harmony import */ var forms42__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! forms42 */ "../../../FormsLibrary/dist/forms/fesm2015/forms.js");





class Test1 extends forms42__WEBPACK_IMPORTED_MODULE_3__["Form"] {
    constructor() {
        super(...arguments);
        this.n = 1;
    }
    add() {
        this.n++;
    }
    init() {
        this.Menu = new _menus_CustomMenu__WEBPACK_IMPORTED_MODULE_2__["CustomMenu"]();
        this.setCallback(this.callback);
        this.Parameters.forEach((value, key) => { console.log(key + "=" + value); });
    }
    show() {
        this.Title = "Test1 context title";
    }
    callback(form, cancelled) {
        //console.log("callback received, cancelled: "+cancelled);
        //this.clearCallStack();
    }
}
Test1.ɵfac = function Test1_Factory(t) { return ɵTest1_BaseFactory(t || Test1); };
Test1.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: Test1, selectors: [["test1"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵInheritDefinitionFeature"]], decls: 13, vars: 1, consts: [[3, "click"]], template: function Test1_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Test1 ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function Test1_Template_button_click_2_listener() { return ctx.showform("test2"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Show Test2");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function Test1_Template_button_click_4_listener() { return ctx.callform("test2"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Call Test2");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function Test1_Template_button_click_6_listener() { return ctx.callform("test3"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Call Test3");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function Test1_Template_button_click_8_listener() { return ctx.close(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Close");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function Test1_Template_button_click_10_listener() { return ctx.add(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](11, "Up");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" state: ", ctx.n, "\n");
    } }, encapsulation: 2 });
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    forms42__WEBPACK_IMPORTED_MODULE_3__["INIT"]
], Test1.prototype, "init", null);
Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    forms42__WEBPACK_IMPORTED_MODULE_3__["SHOW"]
], Test1.prototype, "show", null);
const ɵTest1_BaseFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetInheritedFactory"](Test1);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](Test1, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'test1',
                templateUrl: 'Test1.html',
                styleUrls: []
            }]
    }], null, { init: [], show: [] }); })();


/***/ }),

/***/ "./src/app/forms/Test2.ts":
/*!********************************!*\
  !*** ./src/app/forms/Test2.ts ***!
  \********************************/
/*! exports provided: Test2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Test2", function() { return Test2; });
/* harmony import */ var forms42__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! forms42 */ "../../../FormsLibrary/dist/forms/fesm2015/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");




class Test2 extends forms42__WEBPACK_IMPORTED_MODULE_0__["Form"] {
    constructor() {
        super(...arguments);
        this.n = 1;
    }
    add() {
        this.n++;
    }
}
Test2.ɵfac = function Test2_Factory(t) { return ɵTest2_BaseFactory(t || Test2); };
Test2.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: Test2, selectors: [["test2"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵInheritDefinitionFeature"]], decls: 8, vars: 1, consts: [[3, "click"]], template: function Test2_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Test2 ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function Test2_Template_button_click_2_listener() { return ctx.callform("test3"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Test3");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function Test2_Template_button_click_4_listener() { return ctx.add(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Up");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "field");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" state : ", ctx.n, " ");
    } }, directives: [forms42__WEBPACK_IMPORTED_MODULE_0__["Field"]], encapsulation: 2 });
const ɵTest2_BaseFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetInheritedFactory"](Test2);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](Test2, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'test2',
                templateUrl: 'Test2.html',
                styleUrls: []
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/forms/Test3.ts":
/*!********************************!*\
  !*** ./src/app/forms/Test3.ts ***!
  \********************************/
/*! exports provided: Test3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Test3", function() { return Test3; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var forms42__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! forms42 */ "../../../FormsLibrary/dist/forms/fesm2015/forms.js");




let Test3 = class Test3 extends forms42__WEBPACK_IMPORTED_MODULE_2__["Form"] {
    constructor() {
        super(...arguments);
        this.n = 1;
    }
    add() {
        this.n++;
    }
};
Test3.ɵfac = function Test3_Factory(t) { return ɵTest3_BaseFactory(t || Test3); };
Test3.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: Test3, selectors: [["test3"]], features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵInheritDefinitionFeature"]], decls: 7, vars: 1, consts: [[3, "click"]], template: function Test3_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Test3 ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function Test3_Template_button_click_2_listener() { return ctx.callform("test1"); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Test1");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "button", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function Test3_Template_button_click_4_listener() { return ctx.add(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "Up");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" state: ", ctx.n, "\n");
    } }, encapsulation: 2 });
Test3 = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(forms42__WEBPACK_IMPORTED_MODULE_2__["WIZARD"])(),
    Object(forms42__WEBPACK_IMPORTED_MODULE_2__["WINDOW"])(true, 200, 200, 400, 400),
    Object(forms42__WEBPACK_IMPORTED_MODULE_2__["DATABASE"])({ query: true })
], Test3);

const ɵTest3_BaseFactory = /*@__PURE__*/ _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetInheritedFactory"](Test3);
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](Test3, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"],
        args: [{
                selector: 'test3',
                templateUrl: 'Test3.html',
                styleUrls: []
            }]
    }], null, null); })();


/***/ }),

/***/ "./src/app/menus/CustomMenu.ts":
/*!*************************************!*\
  !*** ./src/app/menus/CustomMenu.ts ***!
  \*************************************/
/*! exports provided: CustomMenu */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomMenu", function() { return CustomMenu; });
/* harmony import */ var forms42__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! forms42 */ "../../../FormsLibrary/dist/forms/fesm2015/forms.js");

class CustomMenu {
    constructor() {
        this.handler = new Handler();
    }
    getHandler() {
        return (this.handler);
    }
    getEntries() {
        let entries = [
            {
                name: "Custom", options: [
                    { name: "Test2", action: "test2" },
                    { name: "Test3", action: "test3" },
                ]
            }
        ];
        return (entries);
    }
}
class Handler extends forms42__WEBPACK_IMPORTED_MODULE_0__["MenuHandler"] {
    onTransactio(action) {
        throw new Error('Method not implemented.');
    }
    onInit() {
    }
    onFormChange(form) {
        if (form != null)
            this.enable();
        else
            this.disable();
    }
    test2() {
        this.app.showform("test2");
    }
    test3() {
        this.app.showform("test3");
    }
    onConnect() {
        console.log("CustomMenu onConnect");
    }
    onDisconnect() {
        console.log("CustomMenu onDisconnect");
    }
}


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _app_ApplicationModule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/ApplicationModule */ "./src/app/ApplicationModule.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "../../node_modules/@angular/platform-browser/__ivy_ngcc__/fesm2015/platform-browser.js");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["platformBrowser"]().bootstrapModule(_app_ApplicationModule__WEBPACK_IMPORTED_MODULE_2__["ApplicationModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ 0:
/*!**********************************************************************************************************!*\
  !*** multi (webpack)-dev-server/client?http://0.0.0.0:0/sockjs-node&sockPath=/sockjs-node ./src/main.ts ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/alex/Repository/FormsDemo/node_modules/webpack-dev-server/client/index.js?http://0.0.0.0:0/sockjs-node&sockPath=/sockjs-node */"../../node_modules/webpack-dev-server/client/index.js?http://0.0.0.0:0/sockjs-node&sockPath=/sockjs-node");
module.exports = __webpack_require__(/*! /Users/alex/Repository/FormsDemo/projects/demo/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map