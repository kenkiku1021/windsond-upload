import m from "mithril";
import { Main, NavBar } from "./ui";
import i18next from "i18next";

class MainPage {
  oninit(vnode) {
    vnode.state.watchDir = "";
    window.app.getWatchDir().then(data => {
      if(data) {
        vnode.state.watchDir = data;
        m.redraw();
      }
    });
    vnode.state.isWatching = false;
    vnode.state.logs = [];
    window.app.onFileChanged((fullpath) => {
      const now = new Date();
      const log = `${now.toLocaleString()} : upload ${fullpath}`;
      vnode.state.logs.unshift(log);
      m.redraw();
    });
  }

  view(vnode) {
    return [
      m(NavBar, "WindSond Uploader"),
      m(Main, [
        m("form", [
          m(".input-group.mb-3", [
            m("span.input-group-text", i18next.t("watchFolder")),
            m("input[type=text].form-control", {
              value: vnode.state.watchDir,
              disabled: true,
            }),
            m("button[type=button].btn.btn-secondary", {
              onclick: async e => {
                vnode.state.watchDir = await window.app.selectWatchDir();
                m.redraw();
              }
            }, i18next.t("browseFolder")),
          ]),
        ]),
        m("p", [
          m("button.btn.btn-primary", {
            disabled: vnode.state.watchDir === "",
            onclick: e => {
              if(vnode.state.isWatching) {
                window.app.stopWatch();
              } else {
                window.app.startWatch();
              }
              window.app.isWatching().then(data => {
                vnode.state.isWatching = data;
                m.redraw();
              });
            },
          }, [
            vnode.state.isWatching ? i18next.t("stopUpload") : i18next.t("startUpload"),
          ]),
          vnode.state.isWatching ? i18next.t("uploading") : i18next.t("paused"),
        ]),
        m("textarea.form-control[rows=10][readonly]", {
          value: vnode.state.logs.join("\n"),
        }),

      ]),
    ];
  }
}

export { MainPage };