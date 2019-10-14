// Current prelude for using `wasm_bindgen`, and this'll get smaller over time!
#![feature(proc_macro, wasm_custom_section, wasm_import_module)]
extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;
use std::mem;
use std::os::raw::c_void;
use std::slice;

// Here we're importing the `alert` function from the browser, using
// `#[wasm_bindgen]` to generate correct wrappers.
#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

// Here we're exporting a function called `greet` which will display a greeting
// for `name` through a dialog.
#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

// I referred following blog. Thank you!
// https://qiita.com/pentamania/items/62e8a84290d7234c0ad4

#[wasm_bindgen]
pub extern "C" fn alloc(size: usize) -> *mut c_void {
    let mut buf = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf); // 意図的にdrop処理を無効にしてメモリを開放させない
    return ptr as *mut c_void;
}

/* メモリ開放処理 */
#[wasm_bindgen]
pub extern "C" fn dealloc(ptr: *mut c_void, cap: usize) {
    unsafe {
        let _buf = Vec::from_raw_parts(ptr, 0, cap);
    }
}

/* フィルター加工処理 */
// 割り算で小数点以下を扱うため型はfloat
const COLOR_SUM: f32 = 765.0;
const SEPIA_R: f32 = 240.0;
const SEPIA_G: f32 = 200.0;
const SEPIA_B: f32 = 118.0;

#[wasm_bindgen]
pub extern "C" fn filter(pointer: *mut u8, max_width: usize, max_height: usize) {
    let pixel_num = max_width * max_height;
    let byte_size = pixel_num * 4;
    let sl = unsafe { slice::from_raw_parts_mut(pointer, byte_size) };

    for i in 0..pixel_num {
        let p = i * 4;
        let r = sl[p];
        let g = sl[p + 1];
        let b = sl[p + 2];
        let avg = ((r + g + b) as f32) / COLOR_SUM;
        sl[p] = (SEPIA_R * avg) as u8; // new r
        sl[p + 1] = (SEPIA_G * avg) as u8; // new g
        sl[p + 2] = (SEPIA_B * avg) as u8; // new b
    }
}
