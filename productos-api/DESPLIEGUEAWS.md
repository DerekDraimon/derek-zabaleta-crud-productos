A continuación describo, con el nivel de detalle que manejo, cómo desplegaría la API usando servicios administrados de AWS:

1. **Contenedor en ECR**
   - Crear un repositorio privado en Amazon ECR (`productos-api`).
   - Construir la imagen local y subirla:
     ```bash
     aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
     docker build -t productos-api .
     docker tag productos-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/productos-api:latest
     docker push <account>.dkr.ecr.us-east-1.amazonaws.com/productos-api:latest
     ```

2. **Base de datos en RDS**
   - Crear una VPC (si no existe) con al menos dos subredes privadas para RDS y dos públicas para el balanceador.
   - Lanzar PostgreSQL en Amazon RDS. Guardar host, usuario y contraseña.

3. **Manejo de secretos**
   - Guardar las credenciales de la base en AWS Secrets Manager con un secreto tipo JSON:
     ```json
     {
       "DB_HOST": "<endpoint-rds>",
       "DB_PORT": "5432",
       "DB_USERNAME": "postgres",
       "DB_PASSWORD": "********",
       "DB_NAME": "products"
     }
     ```
   - Crear un IAM Role para la tarea de ECS con permiso `secretsmanager:GetSecretValue`.

4. **Servicio en ECS Fargate**
   - Crear un cluster de ECS (modo Fargate) dentro de la VPC preparada.
   - Definir una Task Definition, imagen de ECR y variables de entorno.
   - Asociar el secreto creado en el paso anterior para que se inyecte como variables de entorno.
   - Configurar un servicio ECS con mínimo 1 tarea.

5. **Terraform opcional**
   - Un módulo básico para RDS:
     ```hcl
     resource "aws_db_instance" "productos" {
       identifier              = "productos-db"
       engine                  = "postgres"
       engine_version          = "16.1"
       instance_class          = "db.t3.micro"
       allocated_storage       = 20
       username                = var.db_username
       password                = var.db_password
       db_name                 = "products"
       vpc_security_group_ids  = [aws_security_group.db.id]
       db_subnet_group_name    = aws_db_subnet_group.private_subnets.name
       backup_retention_period = 7
       skip_final_snapshot     = true
     }
     ```
   - La idea es completar con módulos para VPC, security groups y ECS, pero este bloque muestra la base para RDS.