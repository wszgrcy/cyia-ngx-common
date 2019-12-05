const importGroup: { [name: string]: Promise<ImportResult> } = {};
export function importScript(path: string, options = { document }): Promise<ImportResult> {

    return importGroup[path] || (importGroup[path] = new Promise(resolve => {
        const onSuccess = (item: ImportResult) => {
            resolve(item);
        };

        const script = options.document.createElement('script');
        script.type = 'text/javascript';
        script.src = path;

        script.onload = () =>
            onSuccess({
                result: true,
                msg: ''
            });

        script.onerror = (error: {}) =>
            onSuccess({
                result: false,
                msg: error,
            });
        options.document.head.appendChild(script);
    }));
}
export interface ImportResult {
    result: boolean;
    msg: any;
}
