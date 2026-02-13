import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Se não tem tenantId, usa o primeiro tenant (ou cria um novo)
    let tenantId = registerDto.tenantId;
    if (!tenantId) {
      const firstTenant = await this.prisma.tenant.findFirst();
      if (!firstTenant) {
        throw new UnauthorizedException('Nenhum restaurante cadastrado');
      }
      tenantId = firstTenant.id;
    }

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        tenantId,
        role: 'USER',
      },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tenantId: user.tenantId,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tenantId: user.tenantId,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        tenantId: true,
        role: true,
      },
    });
  }

  async updateProfile(userId: string, dto: any) {
    const data: any = {};
    if (dto.name) data.name = dto.name;
    if (dto.email) data.email = dto.email;
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        tenantId: true,
        role: true,
      },
    });

    return updated;
  }
}
