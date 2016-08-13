module Bkgdr {
    export class FunctionDefinition {
        
        public functionName: string;
        public params: any[];
        public func: any;
        public id: string;
        
        constructor(functionName: string, params: any[], id?: string) {
            this.functionName = functionName;
            this.params = params;
            this.id = id || Bkgdr.Statics.getUniqueId();
        }
        
        public buildFunction(baseObject?: any) {
            var functionParts: string[] = this.functionName.split(".");
            var builtFunc: any = baseObject || self;
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
           if (!this.params || this.params.length === 0) {
               return this.func.call(context);
           } else {
               return this.func.apply(context, this.params);
           }
       }
        
        
    }
}