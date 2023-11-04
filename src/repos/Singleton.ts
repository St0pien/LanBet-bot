export function Singleton<T extends new (...args: any[]) => any>(target: T): T {
    let instance: T;

    return class {
        constructor(...args: any[]) {
            if (instance) {
                return instance;
            }

            instance = new target(...args);
            return instance;
        }
    } as T;
}
