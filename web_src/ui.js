import m from "mithril";

class NavBar {
  view(vnode) {
    return m("nav.navbar.bg-primary[data-bs-theme=dark]", [
      m(".container-fluid", [
        m("a.navbar-brand[href=#]", vnode.children),
      ]),
    ]);
  }
}

class Main {
  view(vnode) {
    return m("main.container.pt-2", [
      vnode.children,
    ]);
  }
}

export { NavBar, Main };