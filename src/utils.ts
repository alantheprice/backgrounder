module Bkgdr {
    "use strict";
    
    export class Utils {
        
        private static lastNum: number;
        private static char: string;

        private static isWorkerContext (): boolean {
            try {
                return !((<any>self) instanceof Window);
            }
            catch (e) {
               return true;
            }
        }
        
        public static inWorker: boolean = Utils.isWorkerContext();
        
        public static getUniqueId(): string {
            if (!Utils.lastNum) {
                Utils.lastNum = parseInt(Math.random().toFixed(4).slice(2, 6));
            } else {
                Utils.lastNum++;
            }
            if (!Utils.char) {
                Utils.char = Utils.inWorker ? "wo" : "ui";
            }
            return Utils.char + Utils.lastNum;
        }
        
        public static wi(): WorkerInterface {
            return WorkerInterface.getInstance();
        }

        public static getDeferred(): Deferred {
            var deferred: Deferred = <Deferred> {};
            deferred.promise = new Promise(function(resolve, reject) {
                deferred.resolve = resolve;
                deferred.reject = reject;
            });
            return deferred;
        }

        public static getPropertyNamesFromObj(objName): IProperties {
            var props = {funcNames: [], propNames: []};
            var obj = self[objName];
            if (objName.indexOf("Storage") > -1) {
                props.funcNames.push("getItem");
                props.funcNames.push("setItem");
            }
            for(var i in obj) { 
                if (typeof obj[i] === "function") {
                    props.funcNames.push(i);
                } else if (obj.hasOwnProperty(i)) {
                    props.propNames.push(i)
                }
            }
            return props;
        }
        
    }

    export var getUniqueId = Utils.getUniqueId;
    export var getInterface = Utils.wi;
    export var inWorker = Utils.inWorker;

        
    export interface Deferred {
        promise: Promise<{}>;
        resolve: (value: any) => void;
        reject: (value: any) => void;
    }

    export interface IProperties {
        funcNames: string[];
        propNames: string[];
    }

}