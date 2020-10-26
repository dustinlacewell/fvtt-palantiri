export function tp(path: string) {
    return `modules/Palantiri/templates/${path}.html`
}

export async function rt(path: string, data: any = {}) {
    return renderTemplate(tp(path), data);
}

export async function rte(path: string, data: any = {}) {
    const element = document.createElement("div");
    element.innerHTML = (await rt(path, data)).outerHTML;
    return element;
}

export function pick(obj: any, keys: string[]) {
    const newObj = {}
    for (let key of keys) {
        newObj[key] = obj[key];
    }
    return newObj;
}
