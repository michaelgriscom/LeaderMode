import { loadConfiguration } from "../Configuration";
import { expect } from "chai";
import { KeybindingTree } from "../KeybindingTree";

suite("Configuration Tests", function () {
    test("Configuration loads correctly", () => {
        const config = loadConfiguration();
        expect(new KeybindingTree(config.keybindings)).to.not.throw;
    });
});