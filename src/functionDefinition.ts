module Bkgdr {
    export class FunctionDefinition {
        
        public functionName: string;
        public params: any[];
        public func: any;
        public id: string;
        private handleRestricted: boolean = false;
        
        constructor(functionName: string, params: any[], id?: string) {
            this.functionName = functionName;
            this.params = params || [];
            this.id = id || Bkgdr.Utils.getUniqueId();
        }
        
        public buildFunction(baseObject?: any) {
            var functionParts: string[] = this.getDefinitionAsArray();
            var builtFunc: any = baseObject || self;
            if (functionParts[0] === "document" || functionParts[0] === "console") {
                this.handleRestricted = true;
            } 
            functionParts.forEach((funcName) => {
                if (builtFunc && builtFunc[funcName]) {
                    builtFunc = builtFunc[funcName];
                } else {
                    throw new Error(funcName + " does not exist on object");
                }  
            });
            this.func = builtFunc;
        }
        
        public invoke(baseObject?: any): any {
            var context = baseObject || self;
            if (!this.func) {
                this.buildFunction(baseObject);
            }
            if (this.handleRestricted) {
                return this.invokeRestricted();
            }
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
                return self[f[0]][f[1]]();
            }
            if (typeof p[1] === "undefined") {
                return self[f[0]][f[1]](p[0]);
            }
            if (typeof p[2] === "undefined") {
                return self[f[0]][f[1]](p[0], p[1]);
            }
            if (typeof p[3] === "undefined") {
                return self[f[0]][f[1]](p[0], p[1], p[2]);
            }
            return self[f[0]][f[1]](p[0], p[1], p[2], p[3]);
       }

       private getDefinitionAsArray(): string[] {
           return this.functionName.split(".");
       } 
    }

    export var func = FunctionDefinition;
} 