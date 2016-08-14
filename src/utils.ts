module Bkgdr {
    "use strict";
    
    export class Utils {
        
        private static lastNum: number;
        private static char: string;
        
        public static inWorker: boolean = Utils.isWorkerContext();
        
        private static isWorkerContext (): boolean {
            try {
                return !((<any>self) instanceof Window);
            }
            catch (e) {
               return true;
            }
        }
        
        /**
         * DEPRECATED: use getUniqueId.
         */
        public static getRandomId(): string {
            return Utils.getUniqueId();
        }
        
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

        public static getFunctionNamesFromObj(objName): string[] {
            var funcNames = [];
            var obj = self[objName];
            for(var i in obj) { 
                if ( typeof obj[i] === "function") {
                    funcNames.push({name: i, argLength: obj[i].length});
                }
            }
            return funcNames;
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

}