exports.homepage = async(req, res) => {
    try {
        res.render('index', { title: 'Drizzle'} );
    } catch (error) {
        res.status(500).send({message: error.message || "Error"})
    }
}

exports.dashboard = async(req,res) =>  {
    try {
        res.render('dashboard', { title: 'Drizzle' } );
    } catch (error) {
        res.status(500).send({message: error.message || "Error"})
        console.log('err', + error)
    }
}
