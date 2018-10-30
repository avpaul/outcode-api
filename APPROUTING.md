# [avpaul.me](avpaul.me) Routing Plan

| Path | Method | Body | Query | Params | Result object | Comment |
| :--- | :----: |:--: | :------: | :-----: | :------------------------------: | :-------------------------------------------------: |
| [/](localhost:3000)  |  GET  |  -   |    -     |    -    | {posts:[post], stickFront:[post]} |                          -                          |
| [/blog](localhost:3000/blog)  |  GET  |  -   |    -     |    -    |          {posts:[post]}          |                          -                          |
| [/blog/here-goes-the-title](localhost:3000/blog/here-goes-the-title) |  GET  |  -   |    id    |    -    |     {post:post, next:[post]}      |                          - |
| [/blog](localhost:3000/blog)  |  GET  |  -   | category |    -    |  {category:string, posts:[post]}  |                          -                          |
| [/blog](localhost:3000/blog)  |  GET  |  -   |   tag    |    -    |  {category:string, posts:[post]}  |                          -                          |
| [/projects](localhost:3000/projects)  |  GET  |  -   |    -     |    -    |                -                 |                render projects page                 |
| [/ressources](localhost:3000/ressources) |  GET  |  -   |    -     |    -    |                -                 |               render ressources page                |
| [/about](localhost:3000/about)      |  GET  |  -   |    -     |    -    |                -                 |                  render about page                  |
| [/about#contact](localhost:3000/about/#contact)                 |  GET  |  -   |    -     | contact |                -                 | render about page scroll to contact with me section |
| [/about#work](localhost:3000about/#work)                     | GET  |  -   |    -     |  work   |                -                 |  render about page scroll to work with me section   |
| [/admin/login](localhost:3000/admin/login)              |  GET  |  -   |    -     |    -    |                -                 | render admin login page                          -                          |
| [/admin/login](localhost:3000/admin/login)              |  POST  |  {email:string, password:string}   |    -     |    -    |  {id:Number, token: string}              |                          On sucess redirects to [posts](localhost:3000/admin/posts) and sets the token cookie   |
| [/admin/signup](localhost:3000/admin/signup)            |  POST  |  {email:string, password:string}   |    -     | {id:Number, token: string}               -    | Only allowed to tokens with admin previelegies|
| [/admin/posts](localhost:3000/admin/posts)              |  GET  |  -   |    -     | - |  {posts:[post]}   | renders the posts page |
| [/admin/posts/new](localhost:3000/admin/posts/new)      |  GET  |  -   |    -     |    -    |                - |  renders new post page |
| [/admin/posts/new](localhost:3000/admin/posts/new)      |  POST  |  {post:edit}   |    -     |    -    | {saved:boolean, id: number}  | - |
| [/admin/posts/update](localhost:3000/admin/posts/update)     |  GET  | -  |    id     |    -    |  {post:post}   | set isPostUpdate and editingPostID cookies |
| [/admin/.../oldversion](localhost:3000/admin/posts/update/oldversion)     |  GET  | -  |    id     |    -    |  {post:post}   | - |
| [/admin/posts/update](localhost:3000/admin/posts/update)     |  POST  | {post:edit}  |  -  |    -    | {updated: boolean, id: number} |  - |
| [/admin/posts/preview](localhost:3000/admin/posts/preview)   |  GET  |  -   |    id     |    -    |  {post:post, next:[post]} | render post preview page |
| [/admin/posts/publish](localhost:3000/admin/posts/publish)   |  POST  |  -   |    id     |    -    | {published: boolean, id: number, title: string} |  renders the bublished articles |
| [/admin/posts/archive](localhost:3000/admin/posts/archive)   |  POST  | -  | id |    -    |  {archived: boolean, id: number}   |  sets a post status to archived  | 
| [/admin/posts/delete](localhost:3000/admin/posts/delete)     |  DELETE  |  {id}   |    -     |    -    |                -                 |                          -                          |
| [/admin/media](localhost:3000/admin/media)                   |  GET  |  -   |    -     |    -    |  {media: [media]}    | renders the media admin page |
| [/admin/media/upload](localhost:3000/admin/media/upload)     |  POST     |  {use:string, file:file} | - | -  | {saved: boolean, path:string, id: number} |    - |
| [/admin/media/update](localhost:3000/admin/media/update)     |  POST     | {id: number, file: file} |    -     |    -    | {updated: boolean, path:string} |    - |
| [/admin/media/delete](localhost:3000/admin/media/delete)     |  DELETE   |  -   | id  |    -    | {deleted: boolean}  |    - |
| [/admin/comments](localhost:3000/admin/comments)             |  GET      |  -   |    -     |    -    | {comments:[comment]} | renders the comments page |
| [/comments](localhost:3000/comments)                         |  GET      | - | id |    -    | {comments:[comments], id: number} |    - |
| [/comments/new](localhost:3000/comments/new)                 |  POST     | {comment:comment, id: number} | - | - | {saved: boolean, postID: number, id: number} | - |
| [/comments/update](localhost:3000/comments/update)           |  POST     |  {comment:comment, id: number, postID: number} | - | - | {saved: boolean, postID: number, id: number} | - |
| [/comments/delete](localhost:3000/comments/delete)           |  DELETE   |  {id: number, postID: number} | - | - | {deleted: boolean} |    - |
| [/comments/reply](localhost:3000/comments/reply)             |  POST     |  -   |    -     |    -    |                -                 | to think about |


## Completed ##
 /admin/login and /admin/signup