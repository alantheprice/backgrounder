module Bkgdr {
    "use strict";

    export class FunctionDefinition {

        public functionName: string;
        public params: any[];
        public func: any;
        public id: string;
        private handleRestricted: boolean = false;
        private functionContext: any;

        constructor(functionName: string, params: any[], id?: string) {
            this.functionName = functionName;
            this.params = params || [];
            this.id = id || Bkgdr.Utils.getUniqueId();
        }

        public buildFunction(baseObject?: any) {
            var functionParts: string[] = this.getDefinitionAsArray();
            var builtFunc: any = baseObject || self;
            if (restrictedProperties.indexOf(functionParts[0]) > -1) {
                this.handleRestricted = true;
                return;
            }
            var currentContext;
            functionParts.forEach(function (funcName) {
                if (builtFunc && builtFunc[funcName]) {
                    currentContext = builtFunc;
                    builtFunc = builtFunc[funcName];
                }
                else {
                    throw new Error(funcName + " does not exist on object");
                }
            });
            this.functionContext = baseObject || currentContext || self;
            this.func = builtFunc;
        }

        public invoke(baseObject?: any): any {
            if (!this.func) {
                this.buildFunction(baseObject);
            }
            if (this.handleRestricted) {
                return this.invokeRestricted();
            }
            var context = baseObject || this.functionContext || self;
            if (!this.params.length) {
                return this.func.call(context);
            } else {
                return this.func.apply(context, this.params);
            }
        }

        private invokeRestricted() {
            var f: string[] = this.getDefinitionAsArray();
            var p = this.params;
            if (typeof p[0] === "undefined") {
                if (f[2]) {
                    return self[f[0]][f[1]][f[2]]();
                }
                return self[f[0]][f[1]]();
            }
            if (typeof p[1] === "undefined") {
                if (f[2]) {
                    return self[f[0]][f[1]][f[2]](p[0]);
                }
                return self[f[0]][f[1]](p[0]);
            }
            if (typeof p[2] === "undefined") {
                if (f[2]) {
                    return self[f[0]][f[1]][f[2]](p[0], p[1]);
                }
                return self[f[0]][f[1]](p[0], p[1]);
            }
            if (typeof p[3] === "undefined") {
                if (f[2]) {
                    return self[f[0]][f[1]][f[2]](p[0], p[1], p[2]);
                }
                return self[f[0]][f[1]](p[0], p[1], p[2]);
            }
            if (f[2]) {
                return self[f[0]][f[1]][f[2]](p[0], p[1], p[2], p[3]);
            }
            return self[f[0]][f[1]](p[0], p[1], p[2], p[3]);
        }

        private getDefinitionAsArray(): string[] {
            return this.functionName.split(".");
        }
    }

    export var func = FunctionDefinition;
} 