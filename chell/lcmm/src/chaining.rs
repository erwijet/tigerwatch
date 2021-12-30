use rocket::http::{Cookie, Header, Status};
use rocket::Response;
use std::borrow::Cow;

pub trait Chaining<'r> {
    fn chain_set_header<'a: 'r, N, V>(&mut self, name: N, value: V) -> &mut Self
    where
        N: Into<Cow<'a, str>>,
        V: Into<Cow<'a, str>>;

    fn chain_set_cookie<N, V>(&mut self, name: N, value: V) -> &mut Self
    where
        N: Into<Cow<'static, str>>,
        V: Into<Cow<'static, str>>;

    fn chain_set_status(&mut self, status: Status) -> &mut Self;
}

impl<'r> Chaining<'r> for Response<'r> {
    fn chain_set_header<'a: 'r, N, V>(&mut self, name: N, value: V) -> &mut Self
    where
        N: Into<Cow<'a, str>>,
        V: Into<Cow<'a, str>>,
    {
        self.set_header(Header::new(name, value));
        self
    }

    fn chain_set_cookie<N, V>(&mut self, name: N, value: V) -> &mut Self
    where
        N: Into<Cow<'static, str>>,
        V: Into<Cow<'static, str>>,
    {
        self.set_header(Cookie::new(name, value));
        self
    }

    fn chain_set_status(&mut self, status: Status) -> &mut Self {
        self.set_status(status);
        self
    }
}
