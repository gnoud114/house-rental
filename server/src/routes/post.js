import express from 'express'
import * as postController from '../controllers/post'
import verifyToken from '../middlewares/verifyToken'

const router = express.Router()

router.get('/all', postController.getPosts)
router.get('/limit', postController.getPostsLimit)
router.get('/new-post', postController.getNewPosts)
router.get('/detail/:id', postController.getPostDetail)
router.post('/create', verifyToken, postController.createNewPost)
router.get('/user-posts', verifyToken, postController.getPostsOfUser)
router.get('/:id', verifyToken, postController.getPostById)
router.put('/:id', verifyToken, postController.updatePost)
router.delete('/:id', verifyToken, postController.deletePost)


export default router