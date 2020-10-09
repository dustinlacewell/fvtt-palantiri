import ShowDialog from "./ShowDialog";

export default [
    {
        id: "hello-world",
        icon: "fa-question",
        callback: () => ShowDialog(),
    },
    {
        id: "hello-world2",
        icon: "fa-exclamation",
        callback: () => ShowDialog(),
    },
    {
        id: "hello-world3",
        label: "hello",
        callback: () => ShowDialog(),
    },
];
