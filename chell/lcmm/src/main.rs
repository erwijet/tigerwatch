#![feature(decl_macro)]
#![macro_use]
pub mod chaining;

extern crate rocket;

use chaining::Chaining;
use rocket::get;
use rocket::http::Status;
use rocket::routes;
use rocket::Response;

#[get("/")]
fn index() -> &'static str {
    "Lightweight Cookie Middle-Man (tigerwatch, lcmm)\nRun `.\\lcmm-ctl.ps1 stop` to kill this server"
}

#[get("/cb?<skey>")]
fn cb(skey: String) -> Response<'static> {
    let mut res = Response::new();

    res.chain_set_header("location", "http://localhost:3000")
        .chain_set_cookie("skey", skey)
        .chain_set_status(Status::SeeOther);

    res
}

#[rustfmt::skip] // allow one-line fn decl
fn main() { rocket::ignite().mount("/", routes![index, cb]).launch(); }
