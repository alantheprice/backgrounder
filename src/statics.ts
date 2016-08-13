module Bkgdr {
    "use strict";
    
    export class Utils {
        
        private static ABC: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
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
            var random: string = Math.random().toFixed(6).slice(2, 8);
            return Utils.getChar(Math.floor(Math.random() * 10)) + random;
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
        
        /** testing performance of Id generation. **/
        /**
            var testUnique = function() { var perf = window.performance.now(); var unique = Bkgdr.Utils.getUniqueId(); var diff = window.performance.now() - perf; return diff;};
            // console.log(unique); console.log("unique: " + diff);
            var testRandom = function() { var perf = window.performance.now(); var unique = Bkgdr.Utils.getRandomId(); var diff = window.performance.now() - perf; return diff;};
            // console.log(unique); console.log("unique: " + diff);
            var runRandomTest = function(isRandom, iterations) {
                var fun = isRandom ? testRandom : testUnique;
                var total = 0;
                for (var i = 0; i < iterations; i++) {
                    total += fun();
                }
                var title = isRandom ? "Random id Gen: " : "Incremental Id Gen: ";
                console.log(title + total);
            };
            
            runRandomTest(true, 1000);
            runRandomTest(false, 1000);
        **/
        
        
        public static log(message: string | Object) {
            if (Utils.inWorker) {
                WorkerInterface.getInstance().execute("Bkgdr.Utils.log", [message]);
            } else {
                console.log(message);
            }
        }
        
        public static wi(): WorkerInterface {
            return WorkerInterface.getInstance();
        }
        
        private static getChar(num): string {
            return Utils.ABC[num];
        }


        public static getDeferred(): Deferred {
            var deferred: Deferred = <Deferred> {};
            deferred.promise = new Promise(function(resolve, reject) {
                deferred.resolve = resolve;
                deferred.reject = reject;
            });
            return deferred;
        }
        
    }

    export var log = Utils.log;
    export var getUniqueId = Utils.getUniqueId;
    export var getInterface = Utils.wi;

        
    export interface Deferred {
        promise: Promise<{}>;
        resolve: (value: any) => void;
        reject: (value: any) => void;
    }

}