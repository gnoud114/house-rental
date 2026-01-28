import * as postService from '../services/post'

export const getPosts = async (req, res) => {
    try {
        const response = await postService.getPostsService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}
export const getPostsLimit = async (req, res) => {
    try {
        // Parse all query parameters - remove [] from keys first
        const cleanedQuery = {}
        Object.keys(req.query).forEach(key => {
            const cleanKey = key.replace(/\[\]$/, '')
            cleanedQuery[cleanKey] = req.query[key]
        })
        
        // Now destructure from cleaned query
        const { page, priceNumber, areaNumber, ...query } = cleanedQuery
        
        const response = await postService.getPostsLimitService(page, query, { priceNumber, areaNumber })
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}
export const getNewPosts = async (req, res) => {
    try {
        const response = await postService.getNewPostService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}

export const getPostDetail = async (req, res) => {
    try {
        const { id } = req.params
        const response = await postService.getPostDetailService(id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}

export const createNewPost = async (req, res) => {
    try {
        const { categoryCode, title, priceNumber, areaNumber, label } = req.body
        const { id } = req.user
        if (!categoryCode || !id || !title || !priceNumber || !areaNumber || !label) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing inputs'
            })
        }
        const response = await postService.createNewPostService(req.body, id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}

export const getPostsOfUser = async (req, res) => {
    try {
        const { id } = req.user
        const response = await postService.getPostsOfUserService(id)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user?.id
        const response = await postService.getPostByIdService(id, userId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id
        const response = await postService.updatePostService(id, req.body, userId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id
        const response = await postService.deletePostService(id, userId)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        })
    }
}