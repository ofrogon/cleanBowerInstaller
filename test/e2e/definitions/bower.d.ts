declare module "bower" {

    /// <reference types="node" />


    import {EventEmitter} from "events";

    interface Config {
        force?: boolean;
        offline?: boolean;
        verbose?: boolean;
        quiet?: boolean;
        loglevel?: string;
        json?: boolean;
        silent?: boolean;
        cwd?: string;
    }

    interface Property {
        method?: Function;
        get?: Function;
        source?: string;
        name?: string;
        lookup?: any;
        search?: any;
        version?: string;
    }

    interface Option {
        "force-latest"?: boolean;
        production?: boolean;
        save?: boolean;
        "save-dev"?: boolean;
        "save-exact"?: boolean;
    }

    export class commands {
        static help(name: string, config: Config): EventEmitter;
        static home(name: string, config: Config): EventEmitter;
        static info(endpoint: string, property: Property, config: Config): EventEmitter;
        static init(config: Config): EventEmitter;
        static install(endpoints: string[], options: Option, config: Config): EventEmitter;
        static link(name: string, localName: string, config: Config): EventEmitter;
        static list(options: Option, config: Config): EventEmitter;
        static login(options: Option, config: Config): EventEmitter;
        static lookup(name: string, config: Config): EventEmitter;
        static prune(options: Option, config: Config): EventEmitter;
        static register(name: string, source: string, config: Config): EventEmitter;
        static search(name: string, config: Config): EventEmitter;
        static uninstall(names: string[], options: Option, config: Config): EventEmitter;
        static unregister(name: string, config: Config): EventEmitter;
        static update(names: string[], options: Option, config: Config): EventEmitter;
        static version(versionArg: string, options: Option, config: Config): EventEmitter;
    }
}
