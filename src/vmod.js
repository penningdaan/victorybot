module.exports = class VModule {

    __registeredCommandListeners = {}
    __Client

    // Used only internally. Sets up the module with the right parameters
    __setup(__Client) {
        this.__Client = __Client
    }

    // Used only internally. Executes a command listener within the module.
    // Register a command listener using the onCommand() method
    __emit(command, cmdargs, context) {
        if(this.__registeredCommandListeners[command]) {
            let thisReference = this
            this.__registeredCommandListeners[command].forEach(_ => {
                _(cmdargs, context, thisReference, thisReference.__Client)
            });
        }
    }

    // Registers a listener for a command.
    // The commands can be set within the module.json file.
    onCommand(event, method) {
        this.__registeredCommandListeners[event] = Array.isArray(this.__registeredCommandListeners[event]) ? this.__registeredCommandListeners[event].push(method) : this.__registeredCommandListeners[event] = [method]
    }
}