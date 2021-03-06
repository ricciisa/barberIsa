const connection = require("../database/connection");

const CustomersClass = {
    index: async (request, response) => {
        var resposta = await connection.select("*").from("customers");

        return response.status(200).json(resposta);
    },
    create: async (request, response) => {
        const { name, cpf, phone } = request.body;
        console.log("creating a new user");
        await connection("customers").insert({ cpf, phone, name });

        return response.status(201).json({ message: "success" });
    },
    delete: async (request, response) => {
        const { id } = request.params;

        try {
            const candidato = await connection("customers")
                .select("id")
                .where("id", id)
                .first();

            if (candidato["id"] == id) {
                try {
                    await connection("customers").where("id", id).delete();
                    console.log("deleting customer");
                    return response.status(200).json({
                        message: "deletado com sucesso",
                        id_deletado: candidato["id"],
                    });
                } catch (error) {
                    return response.status(400).json({ erro: error });
                }
            }
        } catch (error) {
            return response
                .status(404)
                .json({ message: "not found", erro: error });
        }
    },
    put: async (request, response) => {
        const { name, cpf, phone } = request.body;
        const { id } = request.params;

        try {
            const candidato = await connection("customers")
                .select("id")
                .where("id", id)
                .first();
            if (candidato["id"] == id) {
                try {
                    await connection("customers")
                        .where("id", id)
                        .update({ name, cpf, phone });
                } catch (error) {
					return response.status(400).json({error})
				}
            }
        } catch (error) {
            return response.status(404).json({ error });
		}
		console.log("updating user complete");
		return response.status(200).json({message:'atualizado', customer:{name, cpf, phone}})
	},
	patch: async (request, response) => {
		// const pathParams = request.query
		const id = request.query.id
        const body = request.body

		try {
			const candidato = await connection('customers').select('id').where('id', id).first()
			
			if(candidato['id'] == id){
				try {
					await connection('customers').where('id', id).update(body)
				} catch (error) {
					console.log(error);
					return response.status(400).json({error, number:1})
				}
			}
		} catch (error) {
			console.log(error);
			return response.status(404).json({error, number:2})
		}

		return response.status(200).json({message:'updated'})
	}
};

module.exports = CustomersClass;
