export function random(len) {
    let options = "zexrctybunmkmvgfdtyuiowedfca";
    let length = options.length;
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options[(Math.floor(Math.random() * length))]; // 0 => 20
    }
    return ans;
}
//# sourceMappingURL=utils.js.map