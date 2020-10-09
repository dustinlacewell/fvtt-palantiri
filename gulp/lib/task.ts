import gulp, { TaskFunction } from "gulp";


export function deptask(name: string, deps: any[], fn: TaskFunction): string {
    gulp.task(name, gulp.series(deps.concat(task(name + "subtask", fn))));
    return name;
}

export function task(name: string, fn: TaskFunction): string {
    gulp.task(name, fn);
    return name;
}
