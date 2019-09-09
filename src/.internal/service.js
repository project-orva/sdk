class Service {
    constructor(url, handlers) {
        this.url = url;

        const keys = Object.keys(handlers)
        
        keys.forEach(key => {
            if(typeof key !== 'function') {
                throw new Error(`Error: Service: Invalid Service Handler Type. Expected function, got ${typeof key}`)
            }

            this[key] = handlers['key']
        });
    }
}

export default Service;